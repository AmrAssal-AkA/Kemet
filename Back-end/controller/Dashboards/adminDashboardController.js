const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");
const Guide = require("../../model/guideSchema");

const NO_BOOKING_TIME_NOTE =
  "Booking has no scheduled trip time, availability filtering could not be applied.";
const GUIDE_USER_SELECT = "name email role";

const isPaidStripeSession = (session) =>
  session?.payment_status === "paid" || session?.status === "complete";

const reconcileStripePaymentStatus = async (booking) => {
  if (
    booking.paymentStatus === "Paid" ||
    !booking.stripeSessionId ||
    !process.env.STRIPE_SECRET_KEY
  ) {
    return booking;
  }

  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);

    if (!isPaidStripeSession(session)) return booking;

    booking.paymentStatus = "Paid";
    booking.stripePaymentIntentId = booking.stripePaymentIntentId || session.payment_intent;
    booking.paymentDate = booking.paymentDate || new Date();
    await booking.save();
  } catch {
    return booking;
  }

  return booking;
};

const getFirstValue = (values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const parseTimeToMinutes = (value) => {
  if (value === undefined || value === null || value === "") return null;

  const time = String(value).trim();
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

const getTripSchedule = (booking) => {
  const schedule = booking.tripSchedule;
  if (!schedule?.date || !schedule?.startTime || !schedule?.endTime) return null;

  const date = new Date(schedule.date);
  if (Number.isNaN(date.getTime())) return null;

  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const endMinutes = parseTimeToMinutes(schedule.endTime);
  if (startMinutes === null || endMinutes === null) return null;

  return {
    dayofweek:
      schedule.dayofweek || date.toLocaleDateString("en-US", { weekday: "long" }),
    startMinutes,
    endMinutes,
  };
};

const getDateTimeCandidate = (dateValue, timeValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const explicitMinutes = parseTimeToMinutes(timeValue);
  if (explicitMinutes !== null) {
    return {
      dayofweek: date.toLocaleDateString("en-US", { weekday: "long" }),
      startMinutes: explicitMinutes,
      endMinutes: explicitMinutes,
    };
  }

  const dateMinutes = date.getHours() * 60 + date.getMinutes();
  const hasPersistedTime =
    dateMinutes !== 0 ||
    date.getSeconds() !== 0 ||
    date.getMilliseconds() !== 0;

  if (!hasPersistedTime) return null;

  return {
    dayofweek: date.toLocaleDateString("en-US", { weekday: "long" }),
    startMinutes: dateMinutes,
    endMinutes: dateMinutes,
  };
};

const bookingIncludesTrip = (booking) =>
  Boolean(
    (Array.isArray(booking.trip) && booking.trip.length > 0) ||
      booking.details?.bookingType === "Trip" ||
      booking.details?.bookingType === "Mixed",
  );

const getBookingSchedule = (booking) => {
  if (bookingIncludesTrip(booking)) {
    return getTripSchedule(booking);
  }

  return getDateTimeCandidate(
    booking.flight?.data?.departureDate,
    getFirstValue([
      booking.flight?.data?.departureTime,
      booking.flight?.data?.time,
    ]),
  ) ||
  getDateTimeCandidate(
    booking.hotel?.data?.checkInDate,
    getFirstValue([
      booking.hotel?.data?.checkInTime,
      booking.hotel?.data?.time,
    ]),
  );
};

const isGuideAvailableForSchedule = (guide, schedule) => {
  if (!schedule) return true;

  return (guide.AvailabilityTime || []).some((slot) => {
    const slotDay = String(slot.dayofweek || "").trim().toLowerCase();
    const scheduleDay = String(schedule.dayofweek || "").trim().toLowerCase();
    const startMinutes = parseTimeToMinutes(slot.startTime);
    const endMinutes = parseTimeToMinutes(slot.endTime);

    if (!slotDay || slotDay !== scheduleDay) return false;
    if (startMinutes === null || endMinutes === null) return false;

    if (endMinutes < startMinutes) {
      return (
        schedule.startMinutes >= startMinutes ||
        schedule.endMinutes <= endMinutes
      );
    }

    return schedule.startMinutes >= startMinutes && schedule.endMinutes <= endMinutes;
  });
};

const serializeGuide = (guide) => ({
  _id: guide._id,
  id: guide._id,
  userId: guide.userId?._id || guide.userId,
  name: guide.userId?.name || "",
  email: guide.userId?.email || "",
});

const getValidGuides = async () => {
  const guides = await Guide.find().populate("userId", GUIDE_USER_SELECT);
  return guides.filter((guide) => guide.userId?.role === "guide");
};

const getPopulatedBookingById = (bookingId) =>
  Booking.findById(bookingId)
    .populate({
      path: "trip",
      model: "trips",
      select: "name title city price basePrice finalPrice",
    })
    .populate("userId", "email")
    .populate({
      path: "assignedGuide",
      model: "Guide",
      populate: {
        path: "userId",
        model: "User",
        select: GUIDE_USER_SELECT,
      },
    });

const getGuestCount = (booking) => {
  const guestCollections = [
    booking.guests,
    booking.guestDetails,
    booking.travelers,
    booking.passengers,
  ];

  for (const guests of guestCollections) {
    if (Array.isArray(guests) && guests.length > 0) return guests.length;
    if (guests && typeof guests === "object" && !Array.isArray(guests)) return 1;
  }

  const explicitCount = getFirstValue([
    booking.numberOfGuests,
    booking.guestsCount,
    booking.NumberOfGuests,
    booking.hotel?.NumberOfGuests,
  ]);
  const numericCount = Number(explicitCount);

  if (Number.isFinite(numericCount) && numericCount > 0) return numericCount;
  if (booking.PassportNumber || booking.passportNumber) return 1;

  return null;
};

const mapAdminBooking = (booking) => {
  const bookingObject = booking.toObject();
  const safeBooking = { ...bookingObject };

  delete safeBooking.guests;
  delete safeBooking.guestDetails;
  delete safeBooking.travelers;
  delete safeBooking.passengers;
  delete safeBooking.PassportNumber;
  delete safeBooking.passportNumber;
  delete safeBooking.passportImages;

  return {
    ...safeBooking,
    guestCount: getGuestCount(bookingObject),
    userEmail:
      bookingObject.email ||
      bookingObject.userEmail ||
      bookingObject.customerEmail ||
      bookingObject.userId?.email ||
      null,
  };
};

const getAllUsers = async (req, res, nxt) => {
  try {
    const users = await User.find({ role: { $in: ["user", "guide"] } }).select(
      "-password",
    );
    res.status(200).json({ users });
  } catch (err) {
    nxt(err);
  }
};

const getBookingsDetails = async (req, res, nxt) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "trip",
        model: "trips",
        select: "name title city price basePrice finalPrice",
      })
      .populate("userId", "email")
      .populate({
        path: "assignedGuide",
        model: "Guide",
        populate: {
          path: "userId",
          model: "User",
          select: GUIDE_USER_SELECT,
        },
      });

    await Promise.all(bookings.map(reconcileStripePaymentStatus));
    res.status(200).json({ bookings: bookings.map(mapAdminBooking) });
  } catch (err) {
    nxt(err);
  }
};

const upgradeUser = async (req, res, nxt) => {
  const userId = req.params.userId;
  const newRole = req.body.role;
  try {
    const changeRole = newRole;
    if (!["user", "admin", "guide"].includes(changeRole)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role: changeRole } },
      { new: true, runValidators: true, context: "query" },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (changeRole === "guide") {
      await Guide.findOneAndUpdate(
        { userId: user._id },
        { $setOnInsert: { userId: user._id, role: "guide" } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    res.status(200).json({ message: `User role updated to ${newRole}`, user });
  } catch (err) {
    nxt(err);
  }
};

const confirmBooking = async (req, res, nxt) => {
  const bookingId = req.params.bookingId;
  try{
    const confirmedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "Confirmed" } },
      { new: true, runValidators: true, context: "query" },
    );
    if (!confirmedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking confirmed", booking: confirmedBooking });
  }catch(error){
    nxt(error);
  }
}

const getAvailableGuidesForBooking = async (req, res, nxt) => {
  const bookingId = req.params.bookingId;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const schedule = getBookingSchedule(booking);
    const guides = await getValidGuides();
    const availableGuides = schedule
      ? guides.filter((guide) => isGuideAvailableForSchedule(guide, schedule))
      : guides;

    res.status(200).json({
      guides: availableGuides.map(serializeGuide),
      note: schedule ? undefined : NO_BOOKING_TIME_NOTE,
    });
  } catch (err) {
    nxt(err);
  }
};

const assignGuideToBooking = async (req, res, nxt) => {
  const bookingId = req.params.bookingId;
  const { guideId } = req.body;

  try {
    if (!guideId) {
      return res.status(400).json({ message: "Guide ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const guide = await Guide.findById(guideId).populate("userId", GUIDE_USER_SELECT);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.userId || guide.userId.role !== "guide") {
      return res.status(400).json({ message: "Guide is not linked to a guide user" });
    }

    const schedule = getBookingSchedule(booking);
    if (schedule && !isGuideAvailableForSchedule(guide, schedule)) {
      return res
        .status(400)
        .json({ message: "Guide is not available for this booking time" });
    }

    booking.assignedGuide = guide._id;
    await booking.save();

    const updatedBooking = await getPopulatedBookingById(booking._id);

    res.status(200).json({
      message: "Guide assigned successfully",
      booking: mapAdminBooking(updatedBooking),
      note: schedule ? undefined : NO_BOOKING_TIME_NOTE,
    });
  } catch (err) {
    nxt(err);
  }
};


module.exports = {
  getAllUsers,
  getBookingsDetails,
  upgradeUser,
  confirmBooking,
  getAvailableGuidesForBooking,
  assignGuideToBooking
};
