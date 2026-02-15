const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User signup
exports.signup = (req, res) => {
  try {
    const { email, password, username, city, country } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    const user = User.create(email, password, username, city, country);

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        city: user.city,
        country: user.country
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = User.findByEmail(email);

    if (!user || !User.verifyPassword(user, password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        city: user.city,
        country: user.country
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
exports.getProfile = (req, res) => {
  try {
    const user = User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      city: user.city,
      country: user.country,
      profile_image: user.profile_image,
      created_at: user.created_at
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = (req, res) => {
  try {
    const { city, country, profile_image } = req.body;

    const user = User.update(req.userId, {
      city,
      country,
      profile_image
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        city: user.city,
        country: user.country,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
