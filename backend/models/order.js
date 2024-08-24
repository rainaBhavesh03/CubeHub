const mongoose = require("mongoose");

const Order = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    address: { type: String, required: true },
    mobileNo: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Example regex for 10-digit numbers
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    createdAt: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        },
    ],
    grandTotal: { type: Number, required: true, default: 0},
})

module.exports = mongoose.model("Order", Order);

