const express = require("express");
const router = express.Router();
const addTripController = require("../controller/contentmgt/TripController");


router.get("/", addTripController.getAllTrips);
router.get("/:id", addTripController.getTripById);

module.exports = router;
