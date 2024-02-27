const mongoose = require('mongoose');
const mailSender = require('../utils/sendMail');

const otpSchema = new mongoose.Schema({
    email: {type: String, required: true, trim: true },
    otp: {type: String, required: true },
    createdAt: {type: Date, required: true, default: Date.now(), expires: 5*60*1000 }, // 5 mins
});

async function sendVerificationMail (email, otp) {
    try {
        console.log('before sending mail ', email, otp);
        const mailResponse = await mailSender(email, "Verification Email from CubeHub", otp);
        console.log("Email sent!");
    }
    catch (err) {
        console.log(err);
    }
}

otpSchema.pre('save', async function (next) {
    await sendVerificationMail(this.email, this.otp);
    next();
})


module.exports = mongoose.model('OTP', otpSchema);
