const express = require('express');
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

