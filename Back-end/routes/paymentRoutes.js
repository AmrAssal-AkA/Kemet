const express = require("express");
const router = express.Router();
const payment = require("../controller/BookingMgt/paymentController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.post("/webhook", express.raw({type: "application/json"}), payment.webhook);


router.post("/stripe-checkout", authenticate, authorize("user"), payment.stripeCheckout);
router.get("/success", payment.success);
router.get("/refund", payment.refundPayment);
 
module.exports = router;
