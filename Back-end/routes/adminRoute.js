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
router.get(
  "/AllUsers",
  authenticate,
  authorize("admin"),
  adminDashboardController.getAllUsers,
);

  router.patch("/upgradeUser/:userId", authenticate, authorize("admin"), adminDashboardController.upgradeUser);

// View Booking Details Route for Admin
router.get(
  "/bookingDetails",
  authenticate,
  authorize("admin"),
  adminDashboardController.getBookingsDetails,
);



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

router.get("/stats/revenue", authenticate,authorize("admin"), async (req, res) => {
  const totalRevenue = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  res.status(200).json({
    totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
  });
});

module.exports = router;
