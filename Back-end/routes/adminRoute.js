const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const userRoleUpdate = require("../controller/auth/userRoleUpdate");
const adminDashboardController = require("../controller/Dashboards/adminDashboardController");

// Admin Dashboard Routes
router.get(
  "/AllUsers",
  authenticate,
  authorize("admin"),
  adminDashboardController.getAllUsers,
);
router.patch(
  "/updateRole/:userId",
  authenticate,
  authorize("admin"),
  userRoleUpdate,
);

// View Booking Details Route for Admin
router.get(
  "/bookingDetails",
  authenticate,
  authorize("admin"),
  adminDashboardController.getBookingsDetails,
);

module.exports = router;
