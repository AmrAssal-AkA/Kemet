const express = require("express");
const router = express.Router();
const addTripController = require("../controller/contentmgt/TripController");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");


router.post("/addTrip", authVerifyMW, isAdmin,upload.single("image"),addTripController.createTrip);
router.get("/", addTripController.getAllTrips);
router.get("/:id", addTripController.getTripById);
router.put("/updateTrip/:id",authVerifyMW,isAdmin,upload.single("image"),addTripController.updateTripById);
router.delete("/deleteTrip/:id", authVerifyMW, isAdmin, addTripController.DeleteTripById);

module.exports = router;
