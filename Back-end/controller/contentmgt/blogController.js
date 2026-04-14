const blog = require("../../model/blogSchema");
const cloudinary = require("../../services/cloudinary");

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.userId;
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill the blog" });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Please upload at least one image" });
  }

  try {
    const imageResult = await Promise.all(req.files.map((file) => cloudinary.uploadImage(file.path, "blog_images")));
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
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server Error" , error: error.message});
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
  try {
    const blogByOne = await blog.findById(blogId).populate("author", "name email")  ;
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
    res.status(500).json({ message: "Server Error", error: error.message   });
  }
};

module.exports = { createBlog, getAllBlog, getOneBlogById, updateBlogById, deleteBlogById };
