const express = require("express");
const router = express.Router();
const flightController = require("../controller/BookingMgt/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.post("/search", FlightDestinationMW, flightController.searchFlights);


router.post("/details", flightController.getFlightDetails);


router.post("/price", flightController.priceFlightOffer);

module.exports = router;
