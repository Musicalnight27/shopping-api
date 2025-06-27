const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { placeOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { generateInvoice } = require('../controllers/orderController');

router.use(protect);
router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/all', adminOnly, getAllOrders);
router.get('/:id/invoice', protect, generateInvoice);

module.exports = router;
