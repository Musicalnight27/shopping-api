const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addToCart, getCart, removeCartItem } = require('../controllers/cartController');

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:productId', removeCartItem);

module.exports = router;
