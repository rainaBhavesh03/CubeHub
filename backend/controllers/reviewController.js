const { default: mongoose } = require('mongoose');
const Review = require('../models/review.js');
const Product = require('../models/product.js');

module.exports = {
    addReview: async (req, res) => {
        try {
            const productId = new mongoose.Types.ObjectId(req.body.productId);
            const userId = new mongoose.Types.ObjectId(req.body.userId);

            const review = new Review({
                userId: userId,
                productId: productId,
                comment: req.body.comment,
                stars: req.body.stars,
            });

            await review.save();
            res.status(200).json({
                success:true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create review' });
        }
    },

    deleteReview: async (req, res) => {
        try {
            const reviewId = new mongoose.Types.ObjectId(req.body.reviewId);
            const productId = new mongoose.Types.ObjectId(req.body.productId);
            const currUserId = new mongoose.Types.ObjectId(req.userId); // id of the user that is currently logged in
            const userId = new mongoose.Types.ObjectId(req.body.userId);

            if(req.userId !== req.body.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Uesrs don't match",
                });
            }

            if(req.userId === req.body.userId) console.log("users match");
            const deletedReview = await Review.findOneAndDelete( reviewId );

            if (!deletedReview) {
                return res.status(404).json({
                    success: false,
                    error: 'Review not found',
                });
            }

            const product = await Product.findById( productId );
            const newAverageRating = ( product.averageRating * product.totalReviews - deletedReview.stars ) / ( product.totalReviews - 1 );
            
            product.totalReviews -= 1;
            product.averageRating = newAverageRating;
            await product.save();

            res.status(200).json({
                success: true,
                message: "Review successfully deleted"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to remove review' });
        }
    },

    getReviewsByUserId: async (req, res) => {
        try {
            const reviews = await Review.find({ userId: req.params.userId });

            if(reviews.length === 0){
                return res.status(404).json({ error: "No review from the user was found" });
            }

            res.json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch all reviews from the user' });
        }
    },

    getReviewsByProductId: async (req, res) => {
        try {
            const reviews = await Review.find({ productId: new mongoose.Types.ObjectId(req.params.productId) }).populate('userId', 'username').sort({ createdAt: -1 });

            res.status(200).json({ message: "success", reviews: reviews });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch all reviews for the product' });
        }
    },
}
