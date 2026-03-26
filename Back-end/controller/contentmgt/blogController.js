const blog = require("../../model/blogSchema");
const cloudinary = require("../../services/cloudinary");

// Create Blog
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill the blog" });
  }
  if(!req.file){
    return res.status(400).json({ message: "Please upload an image" });
  }
  const imagePath = req.file.path;

  if(!title || !content || !imagePath){
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const imageResult = await cloudinary.uploader.upload(imagePath, {
      folder: "blogs",
    })
    const blogs = new blog({
      title,
      content,
      imageUrl: imageResult.secure_url,
      cloudinaryId: imageResult.public_id,
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
    const allblogs = await blog.find();
    res.status(201).json(allblogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Single Blog
const getOneBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blogByOne = await blog.findOne({ id: id });
    if (!blogByOne) {
      return res.status(404).json({ message: "blog not found." });
    }
    res.status(201).json(blogByOne);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Blog
const updateBlogById = async (req, res) => {
  try {
    const blogUpdate = await blog.findOneAndUpdate(
      {
        id: req.params.id,
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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Blog
const deleteBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blogDelete = await blog.findOneAndDelete({ id: id });
    if (!blogDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(201).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message   });
  }
};

module.exports = { createBlog, getAllBlog, getOneBlogById, updateBlogById, deleteBlogById };
