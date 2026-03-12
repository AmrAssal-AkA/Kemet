const express = require("express");
const router = express.Router();
const hotelController = require("../controller/BookingMgt/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");


router.get("/search", authVerifyMW, hotelCityValid, hotelController.SearchHotel);
router.get("/offers", authVerifyMW, AuthorizeVerifyMW("admin"), hotelCityValid, hotelController.getHotelOffers);

module.exports = router;
