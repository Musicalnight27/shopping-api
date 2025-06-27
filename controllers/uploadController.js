const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'shopping-app'
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};
