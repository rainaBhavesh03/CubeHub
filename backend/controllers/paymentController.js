import Product from "../models/product.js";
const User = require("../models/user.js");
const sendMail = require("../utils/sendMail.js");
const { instance } = require("../config/razorPay.js");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("..templates/paymentSuccessEmail");
const crypto = require("crypto");

//initiate the razorpay order
exports.capturePayment = async(req, res) => {
    const { cart } = req.body;
    const userId = cart.userId;

    if(cart.items.length === 0) {
        return res.status(500).json({success:false, message:"User cart is empty!"});
    }

    
    const currency = "INR";
    const createdAt = Date.now();
    const options = {
        amount: cart.grandTotal * 100,
        currency,
        receipt: createdAt.toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.status(200).json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const { cart } = req.body.cart;
    const userId = cart.userId;
    const address = req.body.address;
    const mobileNo = req.body.mobileNo;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !cart || !userId || !address || !mobileNo) {
        return res.status(500).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature) {
        // Action on verification
        try {
            await createOrder(cart, address, mobileNo);
            return res.status(200).json({ success: true, message: "Payment Verified" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Order creation failed", error: error.message });
        }
    }
    return res.status(500).json({success:"false", message:"Payment Failed"});

}


const createOrder = async(cart, address, mobileNo) => {
    if (!cart || !cart.userId) {
        throw new Error("Cart or user ID is missing");
    }

    const newOrder = new Order({
        userId: cart.userId,
        address,
        mobileNo,
        items: cart.items,
        grandTotal: cart.grandTotal,
    });

    try {
        await newOrder.save();
    } catch (error) {
        throw new Error("Error saving order: " + error.message);
    }
}


// Check this implementation
exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        console.log("kfd")
        await mailSender(
            enrolledStudent.email,
            Payment Recieved,
             paymentSuccessEmail(${enrolledStudent.firstName},
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}
