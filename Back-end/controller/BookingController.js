const bookingServices = require("../services/Booking.services");

exports.createBooking = async (req, res) => {
    try{
        const booking = await bookingServices.createunifiedBooking(req.body, req.user.id);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}