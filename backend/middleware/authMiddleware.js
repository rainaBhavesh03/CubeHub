const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const accessToken = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(accessToken, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticate };

