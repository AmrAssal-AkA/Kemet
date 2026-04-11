const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const isAdmin = require("../middleware/isAdmin");

router.post("/",upload.array("images", 5),blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:blogId", blogController.getOneBlogById);
router.put("/updateBlog/:blogId", isAdmin,upload.single("image"),blogController.updateBlogById,);
router.delete("/deleteBlog/:blogId", isAdmin, blogController.deleteBlogById);


module.exports = router;
