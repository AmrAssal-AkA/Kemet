const express = require("express");
const router = express.Router();
const contactController = require("../controller/contentmgt/contactController");
const isUser = require("../middleware/isUser");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const isAdmin = require("../middleware/isAdmin");

router.post("/", isUser, contactController.createContact);
router.get("/contacts/",authVerifyMW,isAdmin,contactController.getAllContacts);
router.get("/contacts/:name",authVerifyMW,isAdmin,contactController.getContactByName);
router.delete("/contacts/:name",authVerifyMW,isAdmin, contactController.deleteContactByName);


module.exports = router;
