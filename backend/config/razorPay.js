const razorPay = require("razorpay");
exports.instance = new razorPay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
})
