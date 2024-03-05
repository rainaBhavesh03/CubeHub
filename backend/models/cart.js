const mongoose = require("mongoose");
const User = require('../models/user');

const Cart = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        },
    ],
    grandTotal: { type: Number, required: true, default: 0},
    status: { type: String, enum: ["active", "checkout", "payment received", "payment failed", "delivered"], default: "active" },
})

module.exports = mongoose.model("Cart", Cart);
