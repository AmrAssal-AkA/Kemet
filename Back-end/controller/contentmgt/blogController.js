const blog = require("../../model/blogSchema");
const cloudinary = require("../../config/cloudinary");
const PostLike = require("../../model/PostLike");
const mongoose = require("mongoose");

function getFileSource(file) {
  return file?.buffer || file?.path;
}

function getValidationMessage(error) {
  if (error?.name !== "ValidationError") return "";
  return Object.values(error.errors || {})
    .map((validationError) => validationError.message)
    .filter(Boolean)
    .join(" ");
}

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ message: "Please fill the blog" });
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: "Please upload at least one image" });
  }

  try {
    const imageResult = await Promise.all(
      req.files.map((file) => cloudinary.uploadImage(file.path, "blog_images")),
    );
    const blogs = new blog({
      title,
      content,
      author,
      images: imageResult.map((result) => ({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      })),
    });
    await blogs.save();
    res.status(201).json({ message: "Blog Created" });
  } catch (error) {
    const validationMessage = getValidationMessage(error);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Blog
const getAllBlog = async (req, res) => {
  try {
    const allblogs = await blog.find().populate("author", "name email");
    res.status(201).json(allblogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Single Blog
const getOneBlogById = async (req, res) => {
  const { blogId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(404).json({ message: "Blog not found." });
  }

  try {
    const blogByOne = await blog
      .findById(blogId)
      .populate("author", "name email");
    if (!blogByOne) {
      return res.status(404).json({ message: "blog not found." });
    }

    const BlogLikes = await PostLike.countDocuments({ blogId });
    const blogData = blogByOne.toObject();
    blogData.comments = Array.isArray(blogData.comments) ? blogData.comments : [];
    blogData.likes = BlogLikes;

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Blog
const updateBlogById = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;

    if (req.file) {
      const imageResult = await cloudinary.uploadImage(getFileSource(req.file), "blog_images");
      updateData.images = [
        {
          imageUrl: imageResult.secure_url,
          cloudinaryId: imageResult.public_id,
        },
      ];
    }

    const blogUpdate = await blog.findByIdAndUpdate(
      req.params.blogId,
      updateData,
      { new: true, runValidators: true },
    );
    if (!blogUpdate) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog updated successfully", blog: blogUpdate });
  } catch (error) {
    const validationMessage = getValidationMessage(error);
    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Blog
const deleteBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blogDelete = await blog.findByIdAndDelete(blogId);
    if (!blogDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const WriteBlogComments = async (req, res) => {
    const { blogId } = req.params;
    const commentText =
        req.body?.comment ||
        req.body?.commentText ||
        req.body?.text ||
        req.body?.content;
    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: user is required to comment" });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    if (!String(commentText || "").trim()) {
        return res.status(400).json({ message: "Comment text is required" });
    }

    try {
        const blogPost = await blog.findById(blogId);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (!Array.isArray(blogPost.comments)) {
            blogPost.comments = [];
        }
        const newComment = {
           user: userId,
            comment: String(commentText).trim(),
            createdAt: new Date(),
        };
        blogPost.comments.push(newComment);
        await blogPost.save();
        res.status(201).json({ message: "Comment added successfully" });
    }catch (error) {
        const validationMessage = getValidationMessage(error);
        if (validationMessage) {
            return res.status(400).json({ message: validationMessage });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = {
  createBlog,
  getAllBlog,
  getOneBlogById,
  updateBlogById,
  deleteBlogById,
  WriteBlogComments
};
