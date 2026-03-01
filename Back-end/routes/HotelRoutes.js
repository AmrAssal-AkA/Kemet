const express = require("express");
const router = express.Router();
const hotelController = require("../controller/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");

router.get("/search", hotelCityValid, hotelController.SearchHotel);
router.get("/offers", hotelCityValid, hotelController.getHotelOffers);

module.exports = router;
