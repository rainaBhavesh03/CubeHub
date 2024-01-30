const express = require('express');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const expireTime = 60; // seconds

const refreshAccessToken = (refreshToken) => {
    // Verify and decode the refresh token
    const decoded = jwt.verify(refreshToken, 'refresh-secret-key');

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, 'your-secret-key', { expiresIn: expireTime * 1000 });

    return newAccessToken;
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        // Perform token refresh logic
        const newAccessToken = refreshAccessToken(refreshToken);

        // Send the new access token to the client
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Token refresh failed:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user in the database
        const newUser = new User({ username, email, password, role: 'customer'});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists and the password is correct
        if (user && (await user.comparePassword(password))) {
            // Generate a JWT access token with a short expiration time
            const accessToken = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: expireTime * 1000 });

            // Generate a refresh token with a longer expiration time
            const refreshToken = jwt.sign({ userId: user._id, email: user.email }, 'refresh-secret-key', { expiresIn: '7d' });

            res.status(200).json({ accessToken, refreshToken, role: user.role, expireTime: expireTime * 1000 });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to authenticate user' });
    }
};

const logout = (req, res) => {
  try {
    // You can perform additional tasks before or after logout if needed

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

module.exports = { register, login, refreshToken, logout };

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/protected', authMiddleware.authenticate, (req, res) => {
    if (req.userRole === 'admin') {
        res.json({ message: 'Welcome to the admin panel', userId: req.userId, role: req.userRole });
    } else {
        res.json({ message: 'This is a protected route', userId: req.userId, role: req.userRole });
    }
});

module.exports = router;

