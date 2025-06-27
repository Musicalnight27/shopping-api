const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: {
      _id: '$items.product',
      totalSold: { $sum: '$items.quantity' }
    }},
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'product'
    }},
    { $unwind: '$product' }
  ]);

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    topProducts
  });
};
