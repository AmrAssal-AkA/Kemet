const User = require("../../model/userSchema");
const {sendEmail} = require("../../services/miling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const RESET_PASSWORD_SECRET = process.env.ACCESS_TOKEN_SECRET;
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
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const token = req.query.token || req.params.token || req.body.token;

    try {
        if (!token){
            return res.status(400).json({ message: "Token is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        if (!oldPassword) {
            return res.status(400).json({ message: "Old password is required" });
        }

        const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
        const user = await User.findOne({userId: decoded.userId});
        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch){
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }catch (error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


module.exports = {generateResetToken, resetPassword};