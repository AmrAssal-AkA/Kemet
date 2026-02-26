const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");


const storage = multer.memoryStorage();


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "Kemet/trips",
            transformation: [
              { width: 1200, height: 600, crop: "fill" },
              { quality: "auto" }
            ],
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            use_filename: true
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      req.file.path = result.secure_url;
      req.file.cloudinary_public_id = result.public_id;
    }
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

const uploadImage = [upload.single("image"), uploadToCloudinary];

module.exports = uploadImage;
