const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingMgt/BookingController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.post("/create", authenticate, authorize('user'), BookingController.createBooking);
router.get("/refund/:bookingId", authenticate, authorize('user'), BookingController.cancelBooking);

module.exports = router;
