const sharp = require("sharp");

const validateImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(401).json({message: "No image uploaded"});
  }

  try {
    const metadata = await sharp(req.file.buffer).metadata();
    const {width, height} = metadata;

    if (width < 200 || height < 200) {
      return res.status(401).json({message: "Image resolution too low (minimum 200x200px)"});
    }

    req.imageMetadata = { width, height, format: metadata.format };
    next();
    } catch (err) {
        return res.status(401).json({message: "Invalid image file"});
    }
};

module.exports = validateImage;