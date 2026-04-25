const User = require("../../model/userSchema");
const { sendEmail, resetPasswordTemplate } = require("../../services/miling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET;

const generateResetToken = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = jwt.sign(
      { userId: user.userId },
      RESET_PASSWORD_SECRET,
      { expiresIn: "1h" },
    );
    const resetHashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetToken = resetHashToken;
    user.passwordResetExpires = Date.now() + 3600000; //
    await user.save();
    const resetLink = `http://localhost:3000/auth/PasswordConfirm/?token=${resetToken}`;
    const emailContent = await resetPasswordTemplate(user.name, resetLink);
    await sendEmail({
      to: user.email,
      subject: "Kemet Travel - Password Reset Request",
      html: emailContent,
    });
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {

  const {token, newPassword } = req.body;
  try {
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    let decoded;
    let user;

    try {
      decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
      const hashToken = crypto.createHash("sha256").update(token).digest("hex");
      user = await User.findOne({
        userId: decoded.userId,
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token has expired" });
      }
      return res.status(400).json({ message: "Invalid token" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateResetToken, resetPassword };
