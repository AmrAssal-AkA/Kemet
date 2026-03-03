const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middleware/multer");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");


router.post("/", authVerifyMW,upload.single("image"), blogController.createBlog);
router.get("/", blogController.getAllBlog);
router.get("/:name", blogController.getOneBlog);
router.put("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), upload.single("image"), blogController.updateBlog);
router.delete("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), blogController.deleteBlog);

module.exports = router;
