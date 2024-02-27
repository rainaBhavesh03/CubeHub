const User = require('../models/user');
const bcrypt = require('bcrypt');
const OTP = require('../models/otp');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/sendMail.js');
const expireTime = '1m';

const refreshAccessToken = (refreshToken) => {
    // Verify and decode the refresh token
    const decoded = jwt.verify(refreshToken, 'refresh-secret-key');

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, 'your-secret-key', { expiresIn: expireTime });

    return newAccessToken;
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        // Perform token refresh logic
        const newAccessToken = refreshAccessToken(refreshToken);

        console.log('access token updated!!');
        // Send the new access token to the client
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Token refresh failed:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(user){
            return res.status(401).json({
                success: false,
                message: 'user already registered',
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log('otp generated', otp);

        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            });
            console.log('otp generated in while loop', otp);

            result = await OTP.findOne({otp: otp});
        }

        console.log('outside while loop');
        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: 'otp sent',
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password, otp } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: 'user already exists',
            });
        }

        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);

        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message: 'otp not found'
            });
        }
        else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: 'invalid otp',
            });
        }

        // Create a new user in the database
        const newUser = new User({ username, email, password, role: 'customer'});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({email});

        console.log(user);
        // Check if the user exists and the password is correct
        if (user && (await user.comparePassword(password))) {
            // Generate a JWT access token with a short expiration time
            const accessToken = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: expireTime });

            // Generate a refresh token with a longer expiration time
            const refreshToken = jwt.sign({ userId: user._id, email: user.email }, 'refresh-secret-key', { expiresIn: '1d' });

            // Store the refresh token in the database
            user.refreshToken = refreshToken;
            await user.save();

            res.status(200).json({ accessToken, refreshToken, role: user.role });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to authenticate user' });
    }
};

const resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({success:false,
            message:'Your Email is not registered with us'});
        }

        const token  = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            passToken:token,
                                            passExpiry: Date.now() + 5*60*1000,
                                        },
                                        {new:true});

        console.log(updatedDetails);
        const url = `http://localhost:3000/reset-password/${token}`
        await mailSender(email, 
                        "Find your password reset link for your CubeHub account below :",
                        `Password Reset Link: ${url}`);

        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }  
};

const resetPassword = async (req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }

        const userDetails = await User.findOne({passToken: token});
        if(!userDetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }
        if( userDetails.resetPasswordExpires < Date.now()  ) {
                return res.json({
                    success:false,
                    message:'Token is expired, please regenerate your token',
                });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {passToken:token},
            {password:hashedPassword},
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:'Password reset successful',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}

const logout = (req, res) => {
  try {
    // You can perform additional tasks before or after logout if needed

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

module.exports = { sendOtp, register, login, refreshToken, logout, resetPasswordToken, resetPassword };

