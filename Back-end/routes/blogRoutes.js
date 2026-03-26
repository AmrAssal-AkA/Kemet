const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const isAdmin = require("../middleware/isAdmin");

router.post("/",authVerifyMW,upload.single("image"),blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getOneBlogById);
router.put("/updateBlog/:id", authVerifyMW, isAdmin,upload.single("image"),blogController.updateBlogById,);
router.delete("/deleteBlog/:id", authVerifyMW, isAdmin,blogController.deleteBlogById);


module.exports = router;
