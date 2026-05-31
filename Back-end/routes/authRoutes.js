const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const {
  generateResetToken,
  resetPassword,
} = require("../controller/auth/resetpassword");
const passport = require("passport");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.get("/me", authenticate, (req, res) => {
  const { name, email, role } = req.user;
  return res.status(200).json({ user: { name, email, role } });
});

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/reset-password", generateResetToken);
router.post("/reset-password-confirm", resetPassword);
router.get(
  "/continueWithGoogle",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback,
);

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

router.post("/logout", authenticate, async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };
  res.clearCookie("x-auth-token", cookieOptions);
  res.clearCookie("x-refresh-token", cookieOptions);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
