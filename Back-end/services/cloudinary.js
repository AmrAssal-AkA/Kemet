const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "KEMET", 
    });
    return result.secure_url; 
    console.log("Image uploaded to Cloudinary:", result.secure_url);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; 
  }
};

module.exports = { uploadImage };