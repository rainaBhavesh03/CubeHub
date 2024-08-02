const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');
const { authenticate } = require('../middleware/authMiddleware');

// Admin routes
router.post('/addreview', authenticate, reviewController.addReview);
router.post('/deletereview', authenticate, reviewController.deleteReview);
router.get('/allreviewsbyuser/:userId', authenticate, reviewController.getReviewsByUserId);

router.get('/allreviewsbyproduct/:productId', reviewController.getReviewsByProductId);

module.exports = router;

