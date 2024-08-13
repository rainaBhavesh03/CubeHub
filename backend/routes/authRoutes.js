const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register-beforeOtp', userController.sendOtp);
router.post('/register-afterOtp', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/reset-passwordToken', userController.resetPasswordToken);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logout);

router.get('/getuserdetails', authenticate, userController.getUserDetails);
router.get('/verifyuser', authenticate, userController.verifyUser);

module.exports = router;

