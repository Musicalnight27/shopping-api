const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search || '';
  const category = req.query.category || null;
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 999999;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const query = {
    name: { $regex: search, $options: 'i' },
    price: { $gte: minPrice, $lte: maxPrice }
  };

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate('category')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.json({
    page,
    totalPages: Math.ceil(total / limit),
    total,
    products
  });
};


exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};
