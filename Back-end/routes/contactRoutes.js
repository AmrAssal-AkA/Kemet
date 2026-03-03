const express = require('express');
const router = express.Router();
const contactController = require("../controller/contactController");
const authVerifyMW = require("../middleware/AuthVerifyMW");
const AuthorizeVerifyMW = require("../middleware/AuthorizeMW");

router.post("/", authVerifyMW, contactController.createContact);
router.get("/" , authVerifyMW, AuthorizeVerifyMW("admin"), contactController.getAllContacts);
router.get("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), contactController.getContactByName);
router.delete("/:name", authVerifyMW, AuthorizeVerifyMW("admin"), contactController.deleteContact);

module.exports = router;