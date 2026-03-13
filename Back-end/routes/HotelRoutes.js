const express = require("express");
const router = express.Router();
const hotelController = require("../controller/BookingMgt/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");
const isUser = require("../middleware/isUser");

router.get(
  "/search",
  isUser,
  hotelCityValid,
  hotelController.SearchHotel,
);
router.get(
  "/offers",
  hotelCityValid,
  hotelController.getHotelOffers,
);

module.exports = router;
