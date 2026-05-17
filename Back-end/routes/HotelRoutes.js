const express = require("express");
const router = express.Router();
const hotelController = require("../controller/BookingMgt/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/search", hotelController.SearchHotel);
router.get("/getOneHotelDetails", hotelController.getHotelOffers);

module.exports = router;

