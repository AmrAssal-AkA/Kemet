const express = require("express");
const router = express.Router();
const contactController = require("../controller/contentmgt/contactController");
const isUser = require("../middleware/isUser");

router.post("/", isUser, contactController.createContact);

module.exports = router;
