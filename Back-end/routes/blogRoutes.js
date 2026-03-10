const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middleware/multer");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");


router.post("/", authVerifyMW,upload.single("image"), blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:id", blogController.getOneBlogById);
router.put("/:id", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), blogController.updateBlogById);
router.delete("/:id", authVerifyMW, AuthorizeVerifyMW("admin"), blogController.deleteBlogById);

module.exports = router;
