const blog = require("../../model/blogSchema");
const cloudinary = require("../../config/cloudinary");

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill the blog" });
  }
  const textRegex = /^[a-zA-Z0-9\s]+$/;
  if (!textRegex.test(title) || !textRegex.test(content)) {
    return res
      .status(400)
      .json({ message: "Title and content must contain only letters and spaces." });
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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Blog
const getAllBlog = async (req, res) => {
  try {
    const allblogs = await blog.find();
    res.status(201).json(allblogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Single Blog
const getOneBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blogByOne = await blog
      .findById(blogId)
      .populate("author", "name email");
    if (!blogByOne) {
      return res.status(404).json({ message: "blog not found." });
    }
    res.status(200).json(blogByOne);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Blog
const updateBlogById = async (req, res) => {
  try {
    const blogUpdate = await blog.findByIdAndUpdate(
      req.params.blogId,
      {
        title: req.body.title,
        content: req.body.content,
        images: req.files ? req.files.map((file) => file.path) : null,
      },
      { new: true },
    );
    if (!blogUpdate) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog updated successfully" });
  } catch (error) {
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
    const { comment } = req.body;
    const userId = req.user.id;
    try {
        const blogPost = await blog.findById(blogId);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const newComment = {
           user: userId,
            comment,
            createdAt: new Date(),
        };
        blogPost.comments.push(newComment);
        await blogPost.save();
        res.status(201).json({ message: "Comment added successfully" });
    }catch (error) {
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
