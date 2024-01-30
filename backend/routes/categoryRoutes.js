const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/categories', categoryController.getCategories);

module.exports = router;

