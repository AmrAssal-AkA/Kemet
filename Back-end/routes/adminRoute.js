const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const userRoleUpdate = require("../controller/auth/userRoleUpdate");
const upload = require("../middleware/multer");
const adminDashboardController = require("../controller/Dashboards/adminDashboardController");
const addTripController = require("../controller/contentmgt/TripController");
const blogController = require("../controller/contentmgt/blogController");
const contactController = require("../controller/contentmgt/contactController");

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
// Trip Management Routes
router.post(
  "/addTrip",
  authVerifyMW,
  isAdmin,
  upload.single("image"),
  addTripController.createTrip,
);
router.put(
  "/updateTrip/:id",
  authVerifyMW,
  isAdmin,
  upload.single("image"),
  addTripController.updateTripById,
);
router.delete(
  "/deleteTrip/:id",
  authVerifyMW,
  isAdmin,
  addTripController.DeleteTripById,
);
// Blog Management Routes
router.put(
  "/updateBlog/:id",
  authVerifyMW,
  isAdmin,
  upload.single("image"),
  blogController.updateBlogById,
);
router.delete(
  "/deleteBlog/:id",
  authVerifyMW,
  isAdmin,
  blogController.deleteBlogById,
);
// Contact Management Routes
router.get(
  "/contacts/",
  authVerifyMW,
  isAdmin,
  contactController.getAllContacts,
);
router.get(
  "/contacts/:name",
  authVerifyMW,
  isAdmin,
  contactController.getContactByName,
);
router.delete(
  "/contacts/:name",
  authVerifyMW,
  isAdmin,
  contactController.deleteContact,
);

router.get(
  "/bookingDetails",
  authVerifyMW,
  isAdmin,
  adminDashboardController.getBookingsDetails,
);

module.exports = router;
