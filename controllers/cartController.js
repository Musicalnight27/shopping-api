const CartItem = require('../models/CartItem');

exports.addToCart = async (req, res) => {
  const { product, quantity } = req.body;
  const existing = await CartItem.findOne({ user: req.user._id, product });

  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return res.json(existing);
  }

  const item = await CartItem.create({ user: req.user._id, product, quantity });
  res.status(201).json(item);
};

exports.getCart = async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate('product');
  res.json(items);
};

exports.removeCartItem = async (req, res) => {
  await CartItem.findOneAndDelete({ user: req.user._id, product: req.params.productId });
  res.json({ message: 'Item removed from cart' });
};

