const mongoose = require("mongoose");

// Schema for Creating products

const Product = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
        required: true,
    }],
    brand:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    images:[String],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }],
    new_price:{
        type:Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    stockQuantity:{
        type: Number,
        default: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model("Product", Product);
