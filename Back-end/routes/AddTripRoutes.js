const express = require('express');
const router = express.Router();
const addTripController = require("../controller/addTripController");
const uploadImage = require('../middleware/multerCloudinary');

router.post("/", uploadImage, addTripController.createTrip);
router.get("/" , addTripController.getAllTrips);
router.get("/:name", addTripController.getTripByName);
router.delete("/:name", addTripController.DeletTripByName);



module.exports = router;