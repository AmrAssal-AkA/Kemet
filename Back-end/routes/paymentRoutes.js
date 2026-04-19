const express = require("express");
const router = express.Router();
const paymentController = require("../controller/BookingMgt/paymentController");

router.post("/",paymentController.createPayment);
router.get("/", paymentController.confirmPayment);
router.post("/", paymentController.refundPayment);
router.get("/", paymentController.getUserPayments);
router.get("/", paymentController.getPaymentById);

module.exports = router;