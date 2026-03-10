const mongoose = require("mongoose");
const User = require("../model/userSchema");

const updateUserRole = async (req, res) => {
  const role = String(req.body.role || "")
    .trim()
    .toLowerCase();
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === role) {
      return res.status(200).json({ message: "Role is already set" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateUserRole;
