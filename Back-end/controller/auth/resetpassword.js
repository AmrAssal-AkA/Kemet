const User = require("../../model/userSchema");
const {sendEmail} = require("../../services/miling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RESET_PASSWORD_SECRET = process.env.ACCESS_TOKEN_SECRET ;
const FRONTEND_URL = "http://localhost:3000/auth/PasswrdConfirm";

const generateResetToken = async (req, res) => {
    const {email} = req.body;
    try{
       if (!email) {
           return res.status(400).json({ message: "Email is required" });
       }
       const user = await User.findOne({email});
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }
       const resetToken = jwt.sign({userId: user.userId}, RESET_PASSWORD_SECRET, {expiresIn: "1h"});
       const resetLink = `${FRONTEND_URL}/?token=${resetToken}`;
       await sendEmail({
        to: email,
        subject: "Password Reset Request",
        text: "You requested a password reset. Click the link below to reset your password:",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
       })
       res.status(201).json({message: "Password reset email sent"});
    }catch(error){
        console.error("Error generating reset token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const resetPassword = async (req, res)=> {
    const token = req.query.token ;
    const {newPassword} = req.body;
    try{
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and newPassword are required" });
        }
        if (newPassword.length < 7) {
            return res.status(400).json({ message: "Password must be at least 7 characters" });
        }
        const TokenDecoded = jwt.verify(token, RESET_PASSWORD_SECRET);
        const user = await User.findOne({userId: TokenDecoded.userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: "Password Reset Successful",
            text: "Your password has been reset successfully. If you did not perform this action, please contact support immediately.",
            html: `<p>Your password has been reset successfully. If you did not perform this action, please contact support immediately.</p>`,
        })
        res.status(200).json({ message: "Password reset successfully" });
    }catch(error){
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Reset token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid reset token" });
        }
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {generateResetToken, resetPassword};