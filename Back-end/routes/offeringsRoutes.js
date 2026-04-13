const express = require("express");
const router = express.Router();
const offeringController = require("../controller/contentmgt/offeringController");

router.post("/", offeringController.createOffers);
router.get("/", offeringController.getAllOffers);
router.get("/:Offerings", offeringController.getOneOfferById);
router.put("/:id", offeringController.updateOffersById,);
router.delete("/:offeringg", offeringController.deleteOffersById);

module.exports = router;