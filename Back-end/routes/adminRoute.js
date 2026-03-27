const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const userRoleUpdate = require("../controller/auth/userRoleUpdate");
const adminDashboardController = require("../controller/Dashboards/adminDashboardController");

// Admin Dashboard Routes
router.get(
  "/AllUsers",
  authVerifyMW,
  isAdmin,
  adminDashboardController.getAllUsers,
);
router.patch(
  "/updateRole/:userId",
  authVerifyMW,
  isAdmin,
  userRoleUpdate,
);

// View Booking Details Route for Admin
router.get(
  "/bookingDetails",
  authVerifyMW,
  isAdmin,
  adminDashboardController.getBookingsDetails,
);

module.exports = router;
