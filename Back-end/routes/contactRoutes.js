const express = require('express');
const router = express.Router();
const contactController = require("../controller/contactController");

router.post("/", contactController.createContact);
router.get("/" , contactController.getAllContacts);
router.get("/:name", contactController.getTripBySingle);
router.delete("/:name", contactController.deleteContact);

module.exports = router;