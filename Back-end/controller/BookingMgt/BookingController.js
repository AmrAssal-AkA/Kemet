const Booking = require("../../model/BookingSchema");
const { stripeCheckout, refundPayment } = require("./paymentController");
const { PassportValidation } = require("../../services/passportService");
const cloudinary = require("../../config/cloudinary");

const currencyMapping = {
  USA: "USD",
  EG: "EGP",
  EUR: "EUR",
};

function parseJsonField(value) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeTime(value) {
  if (value === undefined || value === null || value === "") return "";

  return String(value).trim().slice(0, 5);
}

function buildTripSchedule(value) {
  if (!value || typeof value !== "object") return undefined;

  const date = value.date ? new Date(value.date) : null;
  const startTime = normalizeTime(value.startTime);
  const endTime = normalizeTime(value.endTime);

  if (!date || Number.isNaN(date.getTime()) || !startTime || !endTime) {
    return undefined;
  }

  return {
    date,
    startTime,
    endTime,
    dayofweek:
      value.dayofweek ||
      date.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

const createBooking = async (req, res, nxt) => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

    if (!userId && !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, email" });
    }

    const guests = parseJsonField(req.body.guests);
    const flight = parseJsonField(req.body.flight);
    const hotel = parseJsonField(req.body.hotel);
    const trip = parseJsonField(req.body.trip);
    const tripDetails = parseJsonField(req.body.tripDetails);
    const tripSchedule = buildTripSchedule(parseJsonField(req.body.tripSchedule));
    const items = parseJsonField(req.body.items);
    const { PassportNumber, totalPrice } = req.body;
    const guideIncluded = parseBoolean(req.body.guideIncluded);
    const guideFee = guideIncluded ? Number(req.body.guideFee || 0) : 0;

    if (!Array.isArray(guests)) {
      return res.status(400).json({ message: "Guests must be an array" });
    }
    const normalizedGuests = guests.map((guest) => ({
      ...guest,
      name: guest.name || `${guest.firstName || ""} ${guest.lastName || ""}`.trim(),
    }));
    const hasValidGuest = normalizedGuests.every(
      (g) =>
        g.firstName &&
        g.lastName &&
        g.nationality &&
        g.type &&
        g.passportNumber &&
        g.dateOfBirth &&
        g.expiryDate,
    );
    if (!hasValidGuest) {
      return res.status(400).json({
        message:
          "Each guest must have firstName, lastName, nationality, type, passportNumber, dateOfBirth, and expiryDate fields",
      });
    }
    req.body.guests = normalizedGuests;
    req.body.flight = flight;
    req.body.hotel = hotel;
    req.body.trip = trip;
    req.body.tripDetails = tripDetails;
    req.body.tripSchedule = tripSchedule;
    req.body.items = items;

    const ChildAge = (guest) => {
      const today = new Date();
      const birthDate = new Date(guest.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 < 16;
      }
      return age < 16;
    };

    const childerentAgeUnder16 = normalizedGuests.some(
      (g) => g.type === "child" && ChildAge(g),
    );

    if (!childerentAgeUnder16 && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Passport image is required" });
    }


    if (req.files && req.files.length > 0) {
      const passportValidationResult = await PassportValidation({
        width: req.imageMetadata?.width || 0,
        height: req.imageMetadata?.height || 0,
        format: req.imageMetadata?.format || "",
        size: req.files[0].size,
      });

      const passportIssues = Array.isArray(passportValidationResult?.issues)
        ? passportValidationResult.issues
        : [];
      const passportIsValid =
        passportValidationResult?.valid ??
        passportValidationResult?.isReadable ??
        passportIssues.length === 0;

      if (!passportIsValid) {
        return res.status(400).json({
          error:
            passportValidationResult?.message ||
            passportIssues.join(", ") ||
            "Passport image validation failed",
        });
      }
    }
    let passportImage = [];
    if (req.files && req.files.length > 0) {
      passportImage = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploadImage(file.buffer, "passport_images"),
        ),
      );
    }

    let currency = req.body.currency;
    if (!userId || normalizedGuests.length === 0 || !totalPrice) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, guests, totalPrice" });
    }
    const guestNationalities = normalizedGuests.map(
      (g) => currencyMapping[g.nationality] || "USD",
    );
    if (guestNationalities.length > 0) {
      currency = guestNationalities[0];
    }

    const hasTrip = Array.isArray(trip) ? trip.length > 0 : Boolean(trip);
    const hasFlight = Boolean(flight);
    const hasHotel = Boolean(hotel);

    const bookingDetails = {
      bookingType: hasTrip
        ? "Trip"
        : hasFlight && hasHotel
          ? "FlightAndHotel"
          : hasFlight
            ? "Flight"
            : hasHotel
              ? "Hotel"
              : undefined,
    };
    const newBooking = new Booking({
      userId,
      email,
      guests: normalizedGuests,
      flight,
      hotel,
      trip,
      tripDetails,
      tripSchedule,
      guideIncluded,
      guideFee: Number.isFinite(guideFee) && guideFee > 0 ? guideFee : 0,
      PassportNumber,
      totalPrice,
      currency,
      details: bookingDetails,
      status: "Pending",
      paymentStatus: "Pending",
      passportImages: passportImage.map((upload) => ({
        url: upload.secure_url,
        cloudinaryId: upload.public_id,
      })),
    });
    await newBooking.save();

    req.body.bookingId = newBooking._id.toString();
    req.body.email = email;

    const session = await stripeCheckout(req);
    if (!session) {
      return res.status(500).json({ error: "Failed to create Stripe session" });
    }

    await Booking.findByIdAndUpdate(newBooking._id, {
      stripeSessionId: session.id,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      status: "success",
      bookingId: newBooking._id,
      checkoutUrl: session.url,
    });
  } catch (err) {
    nxt(err);
  }
};

const cancelBooking = async (req, res, nxt) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }
    if (booking.paymentStatus === "Paid" && booking.stripePaymentIntentId) {
      const refund = await refundPayment(bookingId);
      if (refund.success) {
        booking.status = "Cancelled";
        booking.paymentStatus = "Refunded";
        await booking.save();
        return res.status(200).json({
          message: "Booking cancelled and payment refunded successfully",
        });
      } else {
        return res.status(500).json({ error: "Failed to process refund" });
      }
    }
    await Booking.findByIdAndUpdate(bookingId, {
      status: "Cancelled",
      paymentStatus: "Refunded",
    });
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    nxt(err);
  }
};

module.exports = {
  createBooking,
  cancelBooking,
};
