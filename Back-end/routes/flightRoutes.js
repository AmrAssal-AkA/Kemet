const express = require("express");
const router = express.Router();
const flightController = require("../controller/BookingMgt/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get(
  "/search",
  authenticate,
  authorize("user"),
  FlightDestinationMW,
  flightController.searchFlights,
);
router.get("/price", authenticate, authorize("user"), FlightDestinationMW, flightController.priceFlight);

module.exports = router;
