const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");

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
    const bookings = await Booking.find().populate({
      path: "trip",
      model: "trips",
      select: "name title city price basePrice finalPrice",
    }).populate("userId", "email");

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


module.exports = {
  getAllUsers,
  getBookingsDetails,
  upgradeUser,
  confirmBooking
};
