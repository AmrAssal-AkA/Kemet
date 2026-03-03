const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authVerifyMW = require("../middleware/AuthVerifyMW");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authVerifyMW, authController.logout);

module.exports = router;