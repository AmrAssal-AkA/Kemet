const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingMgt/BookingController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/confirm", authenticate, authorize("user"), BookingController.createBooking);

module.exports = router;
