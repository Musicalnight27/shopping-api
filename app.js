const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { protect, adminOnly } = require('./middlewares/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/secret', protect, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.user
  });
});

app.get('/api/admin', protect, adminOnly, (req, res) => {
  res.json({ message: 'Hello Admin!' });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;
0