const express = require("express");
const router = express.Router();
const payment = require("../controller/BookingMgt/paymentController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");


router.post("/stripe-checkout", authenticate, authorize("user"), payment.stripeCheckout);


router.get("/success", authenticate, authorize("user"), payment.success);
 
module.exports = router;
