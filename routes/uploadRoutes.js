const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../controllers/uploadController');

const upload = multer({ dest: 'uploads/' }); // Local temp dir

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
