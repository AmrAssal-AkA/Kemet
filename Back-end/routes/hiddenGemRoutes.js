const express = require("express");
const router = express.Router();
const hiddenGemController = require("../controller/contentmgt/hiddenGemController");

router.post("/", hiddenGemController.createHiddenGem);
router.get("/", hiddenGemController.getAllHiddenGem);
router.get("/:HiddenId", hiddenGemController.getOneHiddenGemById);
router.put("/id", hiddenGemController.updateHiddenGemById);
router.delete("/:hiddensId", hiddenGemController.deleteHiddenGemById);

module.exports = router;