const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/", authenticate,authorize("user"),upload.array("images", 5),blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:blogId", blogController.getOneBlogById);
router.put("/updateBlog/:blogId", authenticate,authorize("user"),upload.single("image"),blogController.updateBlogById);
router.delete("/deleteBlog/:blogId", authenticate,authorize("admin", "user"), blogController.deleteBlogById);
router.post("/addComment/:blogId", authenticate,authorize("user"), blogController.WriteBlogComments);


module.exports = router;
