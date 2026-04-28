const express = require("express");
const router = express.Router();
const BookingController = require("../controller/BookingMgt/BookingController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a unified booking and start checkout
 *     description: Requires an authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       201:
 *         description: Booking created and checkout initiated successfully.
 *       400:
 *         description: Booking payload is invalid.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post("/create", authenticate, authorize("user"), BookingController.createBooking);

/**
 * @swagger
 * /api/booking/success:
 *   get:
 *     tags: [Bookings]
 *     summary: Confirm a successful payment for a booking
 *     description: Requires an authenticated user.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment confirmed and booking activated.
 *       400:
 *         description: Session id is missing or payment confirmation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/success", authenticate, authorize("user"), BookingController.paymentSuccess);

/**
 * @swagger
 * /api/booking/my:
 *   get:
 *     tags: [Bookings]
 *     summary: List the current user's bookings
 *     description: Requires an authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Bookings returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.get("/my", authenticate, authorize("user"), BookingController.getMyBookings);

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get a booking by id
 *     description: Requires an authenticated user.
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
 *         description: Booking returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Booking not found.
 */
router.get("/:id", authenticate, authorize("user"), BookingController.getBooking);

/**
 * @swagger
 * /api/booking/{id}/cancel:
 *   patch:
 *     tags: [Bookings]
 *     summary: Cancel a booking
 *     description: Requires an authenticated user.
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
 *         description: Booking cancelled successfully.
 *       400:
 *         description: Booking cannot be cancelled.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Booking not found.
 */
router.patch("/:id/cancel", authenticate, authorize("user"), BookingController.cancelBooking);

module.exports = router;
