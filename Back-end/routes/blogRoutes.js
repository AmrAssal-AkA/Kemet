const express = require("express");
const router = express.Router();
const blogController = require("../controller/contentmgt/blogController");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /api/blog:
 *   post:
 *     tags: [Blogs]
 *     summary: Create a blog post
 *     description: Requires an authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogRequest'
 *     responses:
 *       201:
 *         description: Blog created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Internal server error.
 *   get:
 *     tags: [Blogs]
 *     summary: List all blog posts
 *     responses:
 *       200:
 *         description: Blogs returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal server error.
 */
router.post("/", authenticate,authorize("user"),upload.array("images", 5),blogController.createBlog);
router.get("/", blogController.getAllBlog);

/**
 * @swagger
 * /api/blog/{blogId}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog post by id
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:blogId", blogController.getOneBlogById);

/**
 * @swagger
 * /api/blog/updateBlog/{blogId}:
 *   put:
 *     tags: [Blogs]
 *     summary: Update a blog post
 *     description: Requires an authenticated user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBlogRequest'
 *     responses:
 *       200:
 *         description: Blog updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Blog not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/updateBlog/:blogId", authenticate,authorize("user"),upload.single("image"),blogController.updateBlogById,);

/**
 * @swagger
 * /api/blog/deleteBlog/{blogId}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete a blog post
 *     description: Requires an authenticated admin or user account.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Blog not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/deleteBlog/:blogId", authenticate,authorize("admin", "user"), blogController.deleteBlogById);


module.exports = router;
