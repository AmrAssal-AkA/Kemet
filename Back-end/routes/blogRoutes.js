const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");

router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:name", blogController.getOneBlog);
router.put("/:name", blogController.updateBlog);
router.delete("/:name", blogController.deleteBlog);

module.exports = router;
