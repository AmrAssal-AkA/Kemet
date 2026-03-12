const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const passport = require("passport");

// Register a new user (Sign Up)
router.post("/register", authController.register);

// Verify user's email
router.get("/verify-email", authController.verifyEmail);

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
router.post("/logout", authVerifyMW, authController.logout);

module.exports = router;
