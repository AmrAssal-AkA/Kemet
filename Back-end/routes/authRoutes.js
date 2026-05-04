const express = require("express");
const router = express.Router();
const authController = require("../controller/auth/authController");
const { generateResetToken, resetPassword } = require("../controller/auth/resetpassword");
const passport = require("passport");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a user account and sets `x-auth-token` and `x-refresh-token` cookies on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed or email is already in use.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     tags: [Auth]
 *     summary: Verify a user's email address
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent to the user.
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Missing verification token.
 *       404:
 *         description: User not found for the supplied token.
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Start the password reset flow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       400:
 *         description: Email is missing.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/reset-password", generateResetToken);

/**
 * @swagger
 * /api/auth/reset-password-confirm:
 *   post:
 *     tags: [Auth]
 *     summary: Complete a password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset completed successfully.
 *       400:
 *         description: Token is invalid, expired, or password validation failed.
 *       500:
 *         description: Internal server error.
 */
router.post("/reset-password-confirm", resetPassword);

/**
 * @swagger
 * /api/auth/continueWithGoogle:
 *   get:
 *     tags: [Auth]
 *     summary: Start Google OAuth authentication
 *     responses:
 *       302:
 *         description: Redirects the user to Google's OAuth consent screen.
 */
router.get(
  "/continueWithGoogle",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Handle the Google OAuth callback
 *     responses:
 *       302:
 *         description: Redirects back to the frontend after authentication completes.
 *       401:
 *         description: Google authentication failed.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Authenticates a user and sets `x-auth-token` and `x-refresh-token` cookies on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials or account requires Google sign-in.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh authentication cookies
 *     security:
 *       - refreshCookie: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully.
 *       401:
 *         description: Refresh token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout the current user
 *     responses:
 *       200:
 *         description: Authentication cookies cleared successfully.
 */
router.post("/logout", async (req, res) => {
  const refreshToken  = req.cookies["x-refresh-token"];
  res.clearCookie("x-auth-token");
  res.clearCookie("x-refresh-token");
  res.json({ message: "Logged out successfully" });
});


module.exports = router;
