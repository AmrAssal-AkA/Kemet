const express = require("express");
const router = express.Router();
const flightController = require("../controller/BookingMgt/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");
const isUser = require("../middleware/isUser");

router.get(
  "/search",
  isUser,
  FlightDestinationMW,
  flightController.searchFlights,
);
router.post(
  "/price",
  isUser,
  FlightDestinationMW,
  flightController.priceFlight,
);

module.exports = router;
