const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const isAdmin = require("../middleware/isAdmin");

router.post("/",upload.single("image"),blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getOneBlogById);
router.put("/updateBlog/:id", isAdmin,upload.single("image"),blogController.updateBlogById,);
router.delete("/deleteBlog/:id", isAdmin, blogController.deleteBlogById);


module.exports = router;
