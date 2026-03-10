const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingController");
const authVerifyMW = require("../middleware/AuthVerifyMW");

router.post("/confirm", authVerifyMW, BookingController.createBooking);


module.exports = router;