const express = require("express");
const router = express.Router();
const guideController = require("../controller/Dashboards/guideDashboardController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.post("/setGuideSchedule", authenticate, authorize("guide"), guideController.setGuideSchedule);
router.get("/guideRequiredTrips", authenticate, authorize("guide"), guideController.guideRequiredTrips);
router.get("/guideFee", authenticate, authorize("guide"), guideController.guideFee);


module.exports = router;
