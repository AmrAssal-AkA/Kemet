const bookingServices = require("../../services/Booking.services");

exports.createBooking = async (req, res) => {
  try {
    const result = await bookingServices.createUnifiedBooking(
      req.body,
      req.user.userId,
    );
    res.status(201).json({
      success: true,
      message: "Booking initiated — complete payment to confirm",
      data: result,
    });
  } catch (error) {
    console.error("[BookingController] createBooking error:", error);
    res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ success: false, message: "session_id is required" });
    }

    const booking = await bookingServices.confirmPayment(session_id);
    res.status(200).json({
      success: true,
      message: "Payment confirmed. Booking is now active.",
      data: booking,
    });
  } catch (error) {
    console.error("[BookingController] paymentSuccess error:", error);
    res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingServices.getUserBookings(req.user.userId);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("[BookingController] getMyBookings error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await bookingServices.getBookingById(
      req.params.id,
      req.user.userId,
    );
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("[BookingController] getBooking error:", error);
    res.status(404).json({ success: false, message: error.message || "Booking not found" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingServices.cancelBooking(
      req.params.id,
      req.user.userId,
    );
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("[BookingController] cancelBooking error:", error);
    res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};
