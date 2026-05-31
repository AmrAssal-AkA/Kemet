const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const PostLike = require("../model/PostLike");

router.post("/", authenticate,authorize("user"),upload.array("images", 5),blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:blogId", blogController.getOneBlogById);
router.put("/updateBlog/:blogId", authenticate,authorize("admin", "user"),upload.single("image"),blogController.updateBlogById);
router.delete("/deleteBlog/:blogId", authenticate,authorize("admin", "user"), blogController.deleteBlogById);
router.post("/addComment/:blogId", authenticate,authorize("user"), blogController.WriteBlogComments);


router.post("/like/:blogId", authenticate,authorize("user"), async (req, res, nxt) => {
    try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const blogId = req.params.blogId;

    const existingLike = await PostLike.findOne({ blogId, userId });

    if (existingLike) {
      await PostLike.deleteOne({_id: existingLike._id });
      const likeCount = await PostLike.countDocuments({ blogId });
      return res.status(200).json({ message: "Blog unliked successfully", likeCount });
    }

    await PostLike.create({ blogId, userId });
    const likeCount = await PostLike.countDocuments({ blogId });
    res.status(201).json({ message: "Blog liked successfully", likeCount });

  }catch (err) {
    nxt(err);
  }
});

module.exports = router;
