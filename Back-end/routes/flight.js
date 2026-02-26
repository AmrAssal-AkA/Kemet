const express = require("express");
const router = express.Router();
const flightController = require("../controller/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");

router.get("/search", FlightDestinationMW, flightController.searchFlights);

router.post("/pricing", flightController.flightOfferPricing);

router.post("/book", flightController.createFlightOrder);

module.exports = router;
