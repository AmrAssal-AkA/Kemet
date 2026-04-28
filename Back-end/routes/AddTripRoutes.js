const express = require("express");
const router = express.Router();
const addTripController = require("../controller/contentmgt/TripController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/multer");

/**
 * @swagger
 * /api/Trip/addTrip:
 *   post:
 *     tags: [Trips]
 *     summary: Create a new trip
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *     responses:
 *       201:
 *         description: Trip created successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Internal server error.
 */
router.post("/addTrip", authenticate, authorize("admin"),upload.single("image"),addTripController.createTrip);

/**
 * @swagger
 * /api/Trip:
 *   get:
 *     tags: [Trips]
 *     summary: List all trips
 *     responses:
 *       200:
 *         description: Trips returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Internal server error.
 */
router.get("/", addTripController.getAllTrips);

/**
 * @swagger
 * /api/Trip/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Get a trip by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", addTripController.getTripById);

/**
 * @swagger
 * /api/Trip/updateTrip/{id}:
 *   put:
 *     tags: [Trips]
 *     summary: Update a trip
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTripRequest'
 *     responses:
 *       200:
 *         description: Trip updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/updateTrip/:id",authenticate,authorize("admin"),upload.single("image"),addTripController.updateTripById);

/**
 * @swagger
 * /api/Trip/deleteTrip/{id}:
 *   delete:
 *     tags: [Trips]
 *     summary: Delete a trip
 *     description: Requires an authenticated admin user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/deleteTrip/:id", authenticate,authorize("admin"), addTripController.DeleteTripById);

module.exports = router;
