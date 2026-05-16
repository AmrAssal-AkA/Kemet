const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getUploadOptions = (folder = "KEMET") => ({
  folder,
  transformation: [
    { width: 800, height: 600, crop: "fill" },
    { quality: "auto" },
  ],
});

const uploadImage = async (file, folder = "KEMET") => {
  try {
    if (Buffer.isBuffer(file)) {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          getUploadOptions(folder),
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(file);
      });
    }

    return await cloudinary.uploader.upload(file, getUploadOptions(folder));
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadImage };
