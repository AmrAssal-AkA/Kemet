const express = require("express");
const router = express.Router();
const hotelController = require("../controller/HotelController");
const hotelCityValidation = require("../middleware/HotelCityMW");

router.get("/findHotels", hotelCityValidation, hotelController);

module.exports = router;
