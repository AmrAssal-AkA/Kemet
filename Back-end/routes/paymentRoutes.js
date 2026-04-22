const express = require("express");
const router = express.Router();
const payment = require("../controller/BookingMgt/paymentController");
 
router.post("/stripe-checkout", payment.stripeCheckout);
router.get("/success", payment.success);
 
module.exports = router;