const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const userRoleUpdate = require("../controller/auth/userRoleUpdate");
const adminDashboardController = require("../controller/Dashboards/adminDashboardController");

// Admin Dashboard Routes
router.get(
  "/AllUsers",
  isAdmin,
  adminDashboardController.getAllUsers,
);
router.patch(
  "/updateRole/:userId",
  isAdmin,
  userRoleUpdate,
);

// View Booking Details Route for Admin
router.get(
  "/bookingDetails",
  isAdmin,
  adminDashboardController.getBookingsDetails,
);

module.exports = router;
