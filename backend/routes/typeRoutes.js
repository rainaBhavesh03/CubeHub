const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');

router.get('/types', typeController.getTypes);

module.exports = router;

