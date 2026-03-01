const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingController");

router.post("/confirm", BookingController.createBooking);


module.exports = router;