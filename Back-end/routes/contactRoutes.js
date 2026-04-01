const express = require("express");
const router = express.Router();
const contactController = require("../controller/contentmgt/contactController");
const isUser = require("../middleware/isUser");
const isAdmin = require("../middleware/isAdmin");

router.post("/", isUser, contactController.createContact);
router.get("/contacts/",isAdmin,contactController.getAllContacts);
router.get("/contacts/:name",isAdmin,contactController.getContactByName);


module.exports = router;
