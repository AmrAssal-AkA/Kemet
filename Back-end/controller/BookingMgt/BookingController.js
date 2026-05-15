const Booking = require("../../model/BookingSchema");
const { stripeCheckout, refundPayment } = require("./paymentController");
const { PassportValidation } = require("../../services/passportService");
const cloudinary = require("../../config/cloudinary");

const currencyMapping = {
  USA: "USD",
  EG: "EGP",
  EUR: "EUR",
};

function parseJsonField(body, field) {
  const value = body[field];

  if (typeof value !== "string") {
    return { value };
  }

  try {
    return { value: JSON.parse(value) };
  } catch {
    return { error: `Invalid ${field} format` };
  }
}

function parseMultipartJsonFields(req, res) {
  const body = { ...req.body };
  const fields = ["guests", "flight", "hotel", "trip", "tripDetails", "items"];

  for (const field of fields) {
    const parsed = parseJsonField(body, field);
    if (parsed.error) {
      const message = field === "guests" ? "Invalid guests format" : parsed.error;
      return { error: res.status(400).json({ message }) };
    }
    body[field] = parsed.value;
  }

  return { body };
}

function getPassportImageDataUri(file) {
  if (!file?.buffer) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

const createBooking = async (req, res, nxt) => {
  try {
    const userId = req.user?.userId;
    const email = req.email?.email;

    if (!userId && !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, email" });
    }

    const parsed = parseMultipartJsonFields(req, res);
    if (parsed.error) return parsed.error;
    req.body = parsed.body;

    const {
      guests,
      flight,
      hotel,
      trip,
      tripDetails,
      PassportNumber,
      totalPrice,
    } = parsed.body;

    if (!Array.isArray(guests)) {
      return res.status(400).json({ message: "Guests must be an array" });
    }

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

    const childerentAgeUnder16 = guests.some(
      (g) => g.type === "child" && ChildAge(g),
    );

    if (!childerentAgeUnder16 && !req.file?.buffer) {
      return res.status(400).json({ error: "Passport image is required" });
    }

    const passportImages = req.file?.buffer ? [req.file.buffer] : [];

    if (req.file?.buffer) {
      const passportValidationResult = await PassportValidation({
        width: req.imageMetadata?.width || 0,
        height: req.imageMetadata?.height || 0,
        format: req.imageMetadata?.format || "",
        size: req.file.size || req.file.buffer.length,
      });

      if (!passportValidationResult.isReadable) {
        return res.status(400).json({
          error: "Passport image is not readable",
          issues: passportValidationResult.issues,
        });
      }
    }

    const uploadedPassports = await Promise.all(
      passportImages.map((buffer) => {
        const dataUri = getPassportImageDataUri({
          buffer,
          mimetype: req.file?.mimetype || "image/jpeg",
        });
        return cloudinary.uploadImage(dataUri, "guest_passport_images");
      }),
    );

    let currency = parsed.body.currency;
    if (!userId || guests.length === 0 || !totalPrice) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, guests, totalPrice" });
    }
    const guestNationalities = guests.map(
      (g) => currencyMapping[g.nationality] || "USD",
    );
    if (guestNationalities.length > 0) {
      currency = guestNationalities[0];
    }

    const bookingDetails = {
      bookingType:
        trip && trip.length > 0
          ? "Trip"
          : flight && hotel
            ? "FlightAndHotel"
            : flight
              ? "Flight"
              : hotel
                ? "Hotel"
                : "Mixed",
    };
    const newBooking = new Booking({
      userId,
      email,
      guests,
      flight,
      hotel,
      trip,
      tripDetails,
      PassportNumber,
      totalPrice,
      currency,
      details: bookingDetails,
      status: "Pending",
      paymentStatus: "Pending",
      passportImages: uploadedPassports.map((upload) => ({
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
