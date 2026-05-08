const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    return (true);
  } else {
    return res.status(401).json({message:'Only JPEG, PNG, or WebP images are allowed'});
  }
};

const upload = multer({storage, fileFilter, limits: {fileSize: 10 * 1024 * 1024}});

module.exports = upload;