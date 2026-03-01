const express = require("express");
const router = express.Router();
const flightController = require("../controller/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");

router.get("/search", FlightDestinationMW, flightController.searchFlights);
router.post("/price", FlightDestinationMW, flightController.priceFlight);


module.exports = router;
