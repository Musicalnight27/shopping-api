const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
};
