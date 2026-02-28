const express = require("express");
const router = express.Router();
const addTripController = require("../controller/addTripController");
const upload = require("../middleware/multer");

router.post("/", upload.single("image"), addTripController.createTrip);
router.get("/", addTripController.getAllTrips);
router.get("/:name", addTripController.getTripByName);
router.put("/:name", upload.single("image"), addTripController.updataTripByName);
router.delete("/:name", addTripController.DeletTripByName);


module.exports = router;
