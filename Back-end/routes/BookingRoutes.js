const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingMgt/BookingController");
const isUser = require("../middleware/isUser");

router.post("/confirm", isUser, BookingController.createBooking);


module.exports = router;