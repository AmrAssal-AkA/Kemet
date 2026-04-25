const User = require("../../model/userSchema");
const Booking = require("../../model/BookingSchema");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({role: "user"}).select('-password');
    res.status(200).json({users});
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


const getBookingsDetails = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user").populate("trip");
        res.status(200).json({bookings});
    }catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ error: "Server Error" });
    }
}

const upgradeUser = async (req, res) => {
  const userId = req.params.userId;
  const newRole = req.body.role; 
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const changeRole = newRole;
    if (!["user", "admin", "guide"].includes(changeRole)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    user.role = changeRole;
    await user.save();
    res.status(200).json({ message: `User role updated to ${newRole}` });
  }catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}


module.exports = {
  getAllUsers,
  getBookingsDetails,
  upgradeUser

};
