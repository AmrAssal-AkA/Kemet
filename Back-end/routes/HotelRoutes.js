const express = require("express");
const router = express.Router();
const hotelController = require("../controller/BookingMgt/HotelController");
const hotelCityValid = require("../middleware/HotelCityMW");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * @swagger
 * /api/hotels/search:
 *   post:
 *     tags: [Hotels]
 *     summary: Search hotel availability by city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HotelSearchRequest'
 *     responses:
 *       200:
 *         description: Hotel search results returned successfully.
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Provider or server error.
 */
router.post("/search", hotelCityValid, hotelController.SearchHotel);

/**
 * @swagger
 * /api/hotels/getOneHotelDetails:
 *   get:
 *     tags: [Hotels]
 *     summary: Get offers for a specific hotel
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: checkInDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkOutDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: adults
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Hotel offers returned successfully.
 *       400:
 *         description: Query parameters are missing or invalid.
 *       404:
 *         description: No hotel offers found.
 *       500:
 *         description: Provider or server error.
 */
router.get("/getOneHotelDetails", hotelController.getHotelOffers);

module.exports = router;
