const Booking = require("../../model/BookingSchema");
const { stripeCheckout, refundPayment } = require("./paymentController");
const { PassportValidation } = require("../../services/passportService");
const cloudinary = require("../../config/cloudinary");

const currencyMapping = {
  USA: "USD",
  EG: "EGP",
  EUR: "EUR",
};


const createBooking = async (req, res, nxt) => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

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

    const passportImages = req.files || [];

if (req.files && req.files.length > 0) {
  const passportValidationResult = await PassportValidation({
    width: req.imageMetadata?.width || 0,
    height: req.imageMetadata?.height || 0,
    format: req.imageMetadata?.format || "",
    size: req.files[0].size
    });
  }
    const passportImage = await Promise.all(
      req.files.map((file) => cloudinary.uploadImage(file.path, "passport_images")),
    )


    let currency = req.body.currency;
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
