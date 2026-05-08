const { booking } = require("../../config/amadeus");
const Booking = require("../../model/BookingSchema");
const { stripeCheckout, refundPayment } = require("./paymentController");
const guests = require("../../model/guestSchema");
const {
  BookingConfirmationTemplate,
  sendEmail,
} = require("../../services/miling");
const passport = require("passport");
const validatePassport = require("../auth/passportValidation").validatePassport;
const cloudinary = require("../../config/cloudinary");

const currencyMapping = {
  USA: "USD",
  EG: "EGP",
  EUR: "EUR",
};

const createBooking = async (req, res, nxt) => {
  try {
    const userId = req.user?.userId;
    const email = req.email?.email;

    if (!userId && !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, email" });
    }

    const {
      guests,
      flight,
      hotel,
      trip,
      tripDetails,
      PassportNumber,
      totalPrice,
    } = req.body;

    const PassportImage = req.file ? req.file.buffer : null;

    if (!PassportImage) {
      res.status(400).json({ error: "Passport image is required" });
      return;
    }

    const passportValidationResult = await validatePassport({
      imageMetadata: { width: 0, height: 0, format: "", size: 0 },
      file: { buffer: req.file.buffer },
    });

    if (!passportValidationResult.validation.isReadable) {
      return res.status(400).json({
        error: "Passport image is not readable",
        issues: passportValidationResult.validation.issues,
      });
    }
    const uploadedPassports = await Promise.all(
      PassportImages.map((buffer) =>
        cloudinary.uploadImage(buffer, "guest_passport_images"),
      ),
    );

    let currency = req.body.currency;
    if (!userId || !guests || guests.length === 0 || !totalPrice) {
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
      email: email,
      guests,
      flight,
      hotel,
      trip,
      PassportNumber,
      totalPrice,
      currency,
      details: bookingDetails,
      status: "Pending",
      paymentStatus: "Pending",
      passportImages: uploadedPassports.map(upload => ({
        url: upload.secure_url,
        cloudinaryId: upload.public_id,
      }))
    });
    await newBooking.save();

    req.body.bookingId = newBooking._id.toString();
    req.body.email = email;

    const session = await stripeCheckout(req);
    if (!session) {
      res.status(500).json({ error: "Failed to create Stripe session" });
      return;
    }

    await Booking.findByIdAndUpdate(newBooking._id, {
      stripeSessionId: session.id,
    });

    res.status(201).json({
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
