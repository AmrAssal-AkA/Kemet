const bookingServices = require("../../services/Booking.services");

exports.createBooking = async (req, res) => {
    try{
        const booking = await bookingServices.createUnifiedBooking(req.body, req.user.userId);
        res.status(201).json({
            success: true,
            message: "Booking created successfully", 
            data: booking
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create booking"
        });
    }
}