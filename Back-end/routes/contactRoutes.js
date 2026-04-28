const express = require("express");
const router = express.Router();
const contactController = require("../controller/contentmgt/contactController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contact request created successfully.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Internal server error.
 */
router.post("/",contactController.createContact);

/**
 * @swagger
 * /api/contact/contacts:
 *   get:
 *     tags: [Contact]
 *     summary: List all contact requests
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Contact requests returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.get("/contacts/", authenticate,authorize("admin"), contactController.getAllContacts);

/**
 * @swagger
 * /api/contact/contacts/{name}:
 *   get:
 *     tags: [Contact]
 *     summary: Get a contact request by name
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching contact request returned successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Contact request not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/contacts/:name", authenticate,authorize("admin"), contactController.getContactByName);

module.exports = router;
