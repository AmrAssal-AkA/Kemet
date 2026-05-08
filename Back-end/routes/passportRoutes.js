const express = require("express");
const router = express.Router();
const passportController = require("../controller/auth/passportValidation");

router.get("/health", (req, res) => {
  res.json({status: "ok", service: "Passport Validator"});
});
 
router.post("/api/passport/validate", upload.single("passport"), validateImage, validatePassport);
 
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({message: "File too large (max 10MB)"});
  }
  res.status(400).json({error: err.message});
});

module.exports = router;