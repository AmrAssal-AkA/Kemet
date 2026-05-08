const express = require("express");
const router = express.Router();
const passport = require("../controller/auth/passportValidation");
const upload = require("../middleware/multer");
const validateImage = require("../middleware/passportImageValidation");

router.get("/health", (req, res) => {
  res.json({status: "ok", service: "Passport Validator"});
});
 
router.post("/validate", upload.array("passport", 5), validateImage, passport.validatePassport);
 
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({message: "File too large (max 10MB)"});
  }
  res.status(400).json({error: err.message});
});

module.exports = router;