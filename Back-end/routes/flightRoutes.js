const express = require("express");
const router = express.Router();
const flightController = require("../controller/flighController");
const FlightDestinationMW = require("../middleware/FlightDestinationMW");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");

router.get("/search", authVerifyMW, FlightDestinationMW, flightController.searchFlights);
router.post("/price", authVerifyMW, AuthorizeVerifyMW("admin"), FlightDestinationMW, flightController.priceFlight);


module.exports = router;
