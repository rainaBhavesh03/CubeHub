const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

//router.post('/merge', authenticate, cartController.mergeCart);
router.post('/addtocart', authenticate, cartController.addToCart);
router.post('/removefromcart', authenticate, cartController.removeFromCart);
router.post('/deletefromcart', authenticate, cartController.deleteFromCart);
router.get('/initiallength', authenticate, cartController.fetchInitialCartLength);
router.get('/getcartitems', authenticate, cartController.getCartItems);

module.exports = router;
