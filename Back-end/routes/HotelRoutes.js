const express = require("express");
const router = express.Router();
const hotelController = require("../controller/BookingMgt/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");
const isUser = require("../middleware/isUser");

router.get("/search",  hotelCityValid, hotelController.SearchHotel);
router.get("/getOneHotelDetails", hotelController.getHotelOffers);

module.exports = router;
