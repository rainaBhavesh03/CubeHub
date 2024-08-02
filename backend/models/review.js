const mongoose = require("mongoose");
const Product = require('../models/product.js');

const Review = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    productId: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
    createdAt: { type: Date, default: Date.now() },
    comment: { type: String, required: true },
    stars: { type: Number, required: true },
})

Review.post('save', async function(doc) {
    try {
        const stars = doc.stars;

        const product = await Product.findOne( new mongoose.Types.ObjectId(doc.productId) );

        const newAverageRating = (product.averageRating * product.totalReviews + stars) / (product.totalReviews + 1);
        
        await Product.findByIdAndUpdate( doc.productId, { averageRating: newAverageRating, totalReviews: product.totalReviews+1 });
      } catch (error) {
            console.error('Error calculating average rating:', error);
      }
});

module.exports = mongoose.model("Review", Review);

