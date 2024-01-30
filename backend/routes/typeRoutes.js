const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/types', typeController.getTypes);

module.exports = router;

