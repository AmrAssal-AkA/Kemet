const express = require("express");
const router = express.Router();
const contactController = require("../controller/contentmgt/contactController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/",contactController.createContact);

router.get("/contacts/", authenticate,authorize("admin"), contactController.getAllContacts);

router.get("/contacts/:name", authenticate,authorize("admin"), contactController.getContactByName);

module.exports = router;
