const { booking } = require("../../config/amadeus");
const Booking = require("../../model/BookingSchema");
const { stripeCheckout, refundPayment } = require("./PaymentController");
const guest = require("../../model/GuestSchema");

const currencyMapping = {
  USA: "USD",
  EG: "EGP",
  EUR: "EUR",
};


const createBooking = async (req, res) => {
  try {
    const { userId, guests, flight, hotel, trip, PassportNumber, totalPrice } =
      req.body;

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
      guests,
      flight,
      hotel,
      trip,
      PassportNumber,
      totalPrice,
      currency,
      details: bookingDetails,
    });
    await newBooking.save();

    req.body.bookingId = newBooking._id.toString();

    const session = await stripeCheckout(req);

    res.status(201).json({
      message: "Booking created successfully",
      status: "success",
      bookingId: newBooking._id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create booking", details: error.message });
  }
};

const cancelBooking = async (req, res) => {
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
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to cancel booking", details: error.message });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
};
