const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const adminDashboardController = require("../controller/Dashboards/adminDashboardController");
const User = require("../model/userSchema");
const Booking= require("../model/BookingSchema");
const blog = require("../model/blogSchema");
const trip = require("../model/tripSchema");

// Admin Dashboard Routes
/**
 * @swagger
 * /api/adminDashboard/AllUsers:
 *   get:
 *     tags: [Admin]
 *     summary: List all users
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/AllUsers",
  authenticate,
  authorize("admin"),
  adminDashboardController.getAllUsers,
);

/**
 * @swagger
 * /api/adminDashboard/upgradeUser/{userId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a user's role
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       400:
 *         description: Invalid role payload.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 */
router.patch("/upgradeUser/:userId", authenticate, authorize("admin"), adminDashboardController.upgradeUser);

// View Booking Details Route for Admin
/**
 * @swagger
 * /api/adminDashboard/bookingDetails:
 *   get:
 *     tags: [Admin]
 *     summary: List booking details for admins
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Booking details returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/bookingDetails",
  authenticate,
  authorize("admin"),
  adminDashboardController.getBookingsDetails,
);

/**
 * @swagger
 * /api/adminDashboard/stats/trips:
 *   get:
 *     tags: [Admin]
 *     summary: Get trip dashboard statistics
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Trip statistics returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/stats/trips", authenticate,authorize("admin"), async (req, res) => {
   const [totalUsers, totalBookings, totalTrips, totalBlogs] = await Promise.all([
    User.countDocuments({ role: { $in: ["user", "guide"] } }),
    Booking.countDocuments(),
    trip.countDocuments(),
    blog.countDocuments()
   ]);
   res.status(200).json({
    totalUsers,
    totalBookings,
    totalBlogs,
    totalTrips
   });
});

/**
 * @swagger
 * /api/adminDashboard/stats/blogs:
 *   get:
 *     tags: [Admin]
 *     summary: Get blog dashboard statistics
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Blog statistics returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/stats/blogs", authenticate,authorize("admin"), async (req, res) => {
  const [totalBlogs, publishedBlogs, BlogDuration] = await Promise.all([
    blog.countDocuments(),
    blog.countDocuments({ isPublished: true }),
    blog.countDocuments({ isPublished: true, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
  ]);
  res.status(200).json({
    totalBlogs,
    publishedBlogs,
    BlogDuration
  });
});

/**
 * @swagger
 * /api/adminDashboard/stats/revenue:
 *   get:
 *     tags: [Admin]
 *     summary: Get revenue statistics
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Revenue statistics returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/stats/revenue", authenticate,authorize("admin"), async (req, res) => {
  const totalRevenue = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  res.status(200).json({
    totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
  });
});

module.exports = router;
