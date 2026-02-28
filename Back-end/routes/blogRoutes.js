const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middleware/multer");

router.post("/", upload.single("image"), blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:name", blogController.getOneBlog);
router.put("/:name", upload.single("image"), blogController.updateBlog);
router.delete("/:name", blogController.deleteBlog);

module.exports = router;
