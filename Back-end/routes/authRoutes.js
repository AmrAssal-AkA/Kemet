const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const { generateResetToken, resetPassword } = require("../controller/auth/resetpassword");
const passport = require("passport");
const RefreshToken = require("../model/RefreshTokenSchema");

// Register a new user (Sign Up)
router.post("/register", authController.register);

// Verify user's email
router.get("/verify-email", authController.verifyEmail);

// Password reset routes
router.post("/reset-password", generateResetToken);
router.post("/reset-password/confirm/:token", resetPassword);

// Continue with Google 
router.get(
  "/continueWithGoogle",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback,
);

// Login user (Sign In)
router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.cookies["x-refresh-token"];
  await RefreshToken.deleteOne({ token: refreshToken });
  res.clearCookie("x-auth-token");
  res.clearCookie("x-refresh-token");
  res.json({ message: "Logged out successfully" });
});


module.exports = router;
