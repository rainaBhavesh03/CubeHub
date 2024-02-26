const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/addtocart', cartController.addToCart);
router.post('/removefromcart', cartController.removeFromCart);

module.exports = router;
