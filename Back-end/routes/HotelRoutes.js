const express = require("express");
const router = express.Router();
const hotelController = require("../controller/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");

// Search for available hotel offers
router.get("/findHotels", hotelCityValid, hotelController.getHotelOffers);

// Create a new hotel booking
router.post("/BookHotel", hotelController.BookingHotel);




module.exports = router;
