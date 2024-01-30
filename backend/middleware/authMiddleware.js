const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(accessToken, 'your-secret-key', async (err, decoded) => {
        if (err) {
            // Access token is invalid or expired
            const refreshToken = req.headers.refresh.split(' ')[1];

            if (!refreshToken) {
                return res.status(403).json({ error: 'Invalid token' });
            }

            // Find the user by refresh token
            const user = await User.findOne({ refreshToken });

            if (!user) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            try {
                // Call the refreshToken API to obtain a new access token
                const response = await axios.post('http://localhost:4001/auth/refresh-token', { refreshToken });

                // Set the new access token in the request headers
                req.headers.authorization = `Bearer ${response.data.accessToken}`;

                return next();
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                return res.status(500).json({ error: 'Failed to refresh access token' });
            }
        }

        req.user = decoded;
        next();
    });
};

module.exports = { authenticate };
