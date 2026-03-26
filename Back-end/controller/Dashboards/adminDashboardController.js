const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");

const getAllUsers = async ( res) => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


const getBookingsDetails = async ( res) => {
    try {
        const bookings = await Booking.find().populate("user").populate("trip");
        return bookings;
    }catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ error: "Server Error" });
    }
}

module.exports = {
  getAllUsers,
  getBookingsDetails
};
