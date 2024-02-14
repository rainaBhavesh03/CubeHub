const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');

// Admin routes
router.get('/allproducts', authenticate, productController.getAllProducts);
router.post('/addproduct', authenticate, productController.addProduct);
router.post('/removeproduct', authenticate, productController.removeProduct);
router.put('/editproduct/:id', authenticate, productController.editProduct);
router.get('/productdetail/:productId', productController.productDetail);

router.get('/search', productController.productSearch);

module.exports = router;
