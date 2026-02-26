const blog = require("../model/blogSchema");

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill the blog" });
  }
  let imageUrl = null;
  if (req.file) {
    imageUrl = req.file.path;
  }

  try {
    const blogs = new blog({
      title,
      content,
      imageUrl,
    });
    await blogs.save();
    res.status(201).json({ message: "Blog Created" });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Blog
const getAllBlog = async (req, res) => {
  try {
    const allblogs = await blog.find();
    res.status(201).json(allblogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Blog
const getOneBlog = async (req, res) => {
  const { name } = req.params;
  try {
    const blogByOne = await blog.findOne({ name: name });
    if (!blogByOne) {
      return res.status(404).json({ message: "blog not found." });
    }
    res.status(201).json(blogByOne);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  try {
    const blogUpdate = await blog.findOneAndUpdate(
      {
        name: req.params.name,
      },
      {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file ? req.file.path : null,
      },
      { new: true },
    );
    if (!blogUpdate) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  const { name } = req.params;
  try {
    const blogDelete = await blog.findOneAndDelete({ name: name });
    if (!blogDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createBlog, getAllBlog, getOneBlog, updateBlog, deleteBlog };
