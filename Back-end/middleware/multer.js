const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.memoryStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      req.fileValidationError = "Only images are allowed";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});
