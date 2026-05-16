const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");

const getAllUsers = async (req, res, nxt) => {
  try {
    const users = await User.find({ role: { $in: ["user", "guide"] } }).select(
      "-password",
    );
    res.status(200).json({ users });
  } catch (err) {
    nxt(err);
  }
};

const getBookingsDetails = async (req, res, nxt) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (err) {
    nxt(err);
  }
};

const upgradeUser = async (req, res, nxt) => {
  const userId = req.params.userId;
  const newRole = req.body.role;
  try {
    const changeRole = newRole;
    if (!["user", "admin", "guide"].includes(changeRole)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role: changeRole } },
      { new: true, runValidators: true, context: "query" },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User role updated to ${newRole}`, user });
  } catch (err) {
    nxt(err);
  }
};

const confirmBooking = async (req, res, nxt) => {
  const bookingId = req.params.bookingId;
  try{
    const confirmedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "confirmed" } },
      { new: true, runValidators: true, context: "query" },
    );
    if (!confirmedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking confirmed", booking: confirmedBooking });
  }catch(error){
    nxt(error);
  }
}


module.exports = {
  getAllUsers,
  getBookingsDetails,
  upgradeUser,
  confirmBooking
};