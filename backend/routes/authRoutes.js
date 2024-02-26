const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register-beforeOtp', userController.sendOtp);
router.post('/register-afterOtp', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', userController.logout);

module.exports = router;

