const express = require("express");
const router = express.Router();
const addTripController = require("../controller/addTripController");
const upload = require("../middleware/multer");
const  authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");

router.post("/", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), addTripController.createTrip);
router.get("/", addTripController.getAllTrips);
router.get("/:name", addTripController.getTripByName);
router.put("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), addTripController.updataTripByName);
router.delete("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), addTripController.DeleteTripByName);


module.exports = router;
