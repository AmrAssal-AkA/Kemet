const express = require("express");
const router = express.Router();
const hiddenGemController = require("../controller/contentmgt/hiddenGemController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/multer");

router.post("/", authenticate, authorize("admin"), upload.array("image", 5), hiddenGemController.createHiddenGem);
router.get("/", hiddenGemController.getAllHiddenGem);
router.get("/:id", hiddenGemController.getOneHiddenGemById);
router.put("/:id", authenticate, authorize("admin"), hiddenGemController.updateHiddenGemById);
router.delete("/:id", authenticate, authorize("admin"), hiddenGemController.deleteHiddenGemById);

module.exports = router;