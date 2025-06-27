const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');


exports.placeOrder = async (req, res) => {
  const cartItems = await CartItem.find({ user: req.user._id }).populate('product');

  if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const items = cartItems.map(item => ({
    product: item.product._id,
    quantity: item.quantity
  }));

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    status: 'pending'
  });

  await CartItem.deleteMany({ user: req.user._id });

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product');
  res.json(orders);
};

exports.generateInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user')
    .populate('items.product');

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const doc = new PDFDocument({ margin: 30 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=invoice-${order._id}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${order._id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.fontSize(14).text('Items:', { underline: true });

  order.items.forEach((item, index) => {
    doc.fontSize(12).text(
      `${index + 1}. ${item.product.name} - Qty: ${item.quantity} - ₹${item.product.price * item.quantity}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.total}`, { align: 'right' });

  doc.end();
};