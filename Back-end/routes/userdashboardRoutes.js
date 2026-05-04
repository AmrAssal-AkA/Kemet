const exporess = require("express");
const router = exporess.Router();

const userDashboardController = require("../controller/Dashboards/userDashboardController");
const User = require("../model/userSchema");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.get("/BookedTrips",authenticate, authorize("user"), userDashboardController.getBookedTrips);


router.post("/saveTrips/:tripId", authenticate, authorize("user"), userDashboardController.saveTrip);


router.get("/savedTrips", authenticate, authorize("user"), userDashboardController.getSavedTrips);


router.delete("/removeSavedTrip/:tripId", authenticate, authorize("user"), userDashboardController.removeSavedTrip);


router.patch("/AddProfilePicture",authenticate, authorize("user"),upload.single("profilePicture"), userDashboardController.updateProfilePicture);


module.exports = router;
