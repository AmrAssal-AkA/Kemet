const express = require("express");
const router = express.Router();
const addTripController = require("../controller/contentmgt/TripController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/multer");


router.post("/addTrip", authenticate, authorize("admin"),upload.array("image"),addTripController.createTrip);


router.get("/", addTripController.getAllTrips);


router.get("/:id", addTripController.getTripById);


router.put("/updateTrip/:id",authenticate,authorize("admin"),upload.array("image"),addTripController.updateTripById);


router.delete("/deleteTrip/:id", authenticate,authorize("admin"), addTripController.DeleteTripById);

module.exports = router;
