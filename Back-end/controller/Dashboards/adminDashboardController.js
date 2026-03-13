const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");

const getAllUsers = async (req) => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Server Error");
  }
};


const getBookingsDetails = async (req) => {
    try {
        const bookings = await Booking.find().populate("user").populate("trip");
        return bookings;
    }catch (error) {
        console.error("Error fetching booking details:", error);
        throw new Error("Server Error");
    }
}

module.exports = {
  getAllUsers,
  getBookingsDetails
};
