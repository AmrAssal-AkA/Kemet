const express = require("express");
const router = express.Router();
const hiddenGemController = require("../controller/contentmgt/TripController");

router.post("/addTrip", addTripController.createTrip);
router.get("/", addTripController.getAllTrips);
router.get("/:id", addTripController.getTripById);
router.put("/updateTrip/:id", addTripController.updateTripById);
router.delete("/deleteTrip/:id", addTripController.DeleteTripById);

module.exports = router;