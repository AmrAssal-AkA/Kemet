const express = require("express");
const router = express.Router();
const addTripController = require("../controller/addTripController");
const upload = require("../middleware/multer");
const  authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");

router.post("/", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), addTripController.createTrip);
router.get("/", addTripController.getAllTrips);
router.get("/:id", addTripController.getTripById);
router.put("/:id", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), addTripController.updateTripById);
router.delete("/:id", authVerifyMW, AuthorizeVerifyMW("admin"), addTripController.DeleteTripById);


module.exports = router;
