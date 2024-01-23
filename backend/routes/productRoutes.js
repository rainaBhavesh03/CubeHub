const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/allproducts', productController.getAllProducts);
router.post('/addproduct', productController.addProduct);
router.post('/removeproduct', productController.removeProduct);
router.put('/editproduct/:id', productController.editProduct);
router.get('/productdetail/:productId', productController.productDetail);

module.exports = router;
