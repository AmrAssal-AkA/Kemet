const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const isUser = require("../middleware/isUser");

router.post(
  "/",
  isUser,
  upload.single("image"),
  blogController.createBlog,
);
router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getOneBlogById);

module.exports = router;
