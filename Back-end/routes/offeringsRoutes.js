const express = require("express");
const router = express.Router();
const offeringController = require("../controller/contentmgt/offeringController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/multer");


router.post("/", authenticate, authorize("admin"), upload.array("image", 5), offeringController.createOffers);
router.get("/", offeringController.getAllOffers);
router.get("/:id", offeringController.getOneOfferById);
router.put("/:id", authenticate, authorize("admin"), upload.array("image", 5), offeringController.updateOffersById);
router.delete("/:id", authenticate, authorize("admin"), offeringController.deleteOffersById);

module.exports = router;
