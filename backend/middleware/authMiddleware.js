const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken || accessToken.length === 0 || accessToken === 'undefined') {
        return res.status(401).json({ error: 'Invalid access token' });
    }

    try {
        const decoded = jwt.verify(accessToken, 'your-secret-key');
        req.user = decoded;

        // Option 1: Accessing user ID from decoded payload (if included)
        if (decoded.userId) {
            req.userId = decoded.userId;
        }

        next();
    } catch (error) {
        // Check for expired token and attempt refresh
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.headers.refresh?.split(' ')[1];

            if (!refreshToken || refreshToken.length === 0 || refreshToken === 'undefined') {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            try {
                // Call the refreshToken API to obtain a new access token
                const response = await axios.post('http://localhost:4001/auth/refresh-token', { refreshToken });

                // Set the new access token in the request headers
                req.headers.authorization = `Bearer ${response.data.accessToken}`;

                // Option 1 (continued): Store user ID from new decoded token
                const newDecoded = jwt.verify(response.data.accessToken, 'your-secret-key');
                if (newDecoded.userId) {
                    req.userId = newDecoded.userId;
                }

                next();
            } catch (refreshError) {
                return res.status(403).json({ error: 'Failed to refresh access token' });
            }
        } else {
            return res.status(403).json({ error: 'Failed to verify access token' });
        }
    }
};


module.exports = { authenticate };
