const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

exports.createPaymentOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: 'INR',
    receipt: `rcptid_${Math.floor(Math.random() * 1000000)}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);
  res.json(razorpayOrder);
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    await Order.findByIdAndUpdate(orderId, { status: 'paid' });
    res.json({ message: 'Payment verified and order marked as paid' });
  } else {
    res.status(400).json({ error: 'Invalid payment signature' });
  }
};
