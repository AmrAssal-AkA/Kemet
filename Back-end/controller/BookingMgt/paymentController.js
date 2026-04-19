const paymentServices = require("../../services/paymentServices");

// Create Payment
const createPayment = async (req, res) => {
  try {
    const {bookingId, amount, currency, metadata} = req.body;
    const result = await paymentServices.createPayment({
      userId: req.user.userId,
      bookingId,
      amount,
      currency,
      metadata,
    });
    res.status(201).json({success: true, message: "Payment created successfully", data: result});
    } catch (error) {
    console.error("Payment creation error:", error);
    res.status(400).json({success: false, message: "Failed to create payment"});
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const {paymentId} = req.params;
    const payment = await paymentServices.confirmPayment(paymentId);
    res.status(200).json({success: true, message: "Payment confirmed", data: payment});
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(400).json({success: false, message: "Failed to confirm payment",});
  }
};

// Refund Payment
const refundPayment = async (req, res) => {
  try {
    const {paymentId} = req.params;
    const {amount} = req.body;
    const payment = await paymentServices.refundPayment(paymentId, amount);
    res.status(200).json({success: true, message: "Payment refunded successfully", data: payment});
  } catch (error) {
    console.error("Refund error:", error);
    res.status(400).json({success: false, message: "Failed to process refund"});
  }
};

// Get user payments
const getUserPayments = async (req, res) => {
  try {
    const payments = await paymentServices.getUserPayments(req.user.userId);
    res.status(200).json({success: true, message: "Payments retrieved successfully", data: payments});
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(400).json({success: false, message: "Failed to retrieve payments"});
  }
};

// Get user payments by id
const getPaymentById = async (req, res) => {
  try {
    const {paymentId} = req.params;
    const payment = await paymentServices.getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({success: false, message: "Payment not found"});
    }
    res.status(200).json({success: true, message: "Payment retrieved successfully", data: payment});
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(400).json({success: false, message: "Failed to retrieve payment"});
  }
};

module.exports = {createPayment, confirmPayment, refundPayment, getUserPayments, getPaymentById};