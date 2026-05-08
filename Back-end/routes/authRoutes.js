const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const { generateResetToken, resetPassword } = require("../controller/auth/resetpassword");
const passport = require("passport");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

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


router.post("/logout",authenticate, async (req, res) => {
  const refreshToken  = req.cookies["x-refresh-token"];
  res.clearCookie("x-auth-token");
  res.clearCookie("x-refresh-token");
  res.json({ message: "Logged out successfully" });
});


module.exports = router;
