import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/register-beforeOtp', { email });
            
            console.log(response);
            if(response){
                setOtpSent(!otpSent);
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleOtp = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/register-afterOtp', { username, email, password, otp }); 

            if(response){
                alert('User registration completed!');

                navigate('/login');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="register">
            <div className="register-content">
                <div className="register-left">
                    <p className="register-header">Create your own CubeHub account</p>
                </div>
                {otpSent ? (
                    <div className="register-right">
                        <p className="register-otpmessage">We have sent an email to your email id : {email}<br />Enter the OTP provided in the mail to verify your email account.</p>
                        <label className="register-label">OTP :</label>
                        <input className="register-id-input" type="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <div className="register-submit">
                            <Link className="register-register" to={`/login`}>Already have an account?</Link>
                            <button className="register-btn" onClick={handleOtp}>Check</button>
                        </div>
                    </div>
                ) : (
                    <div className="register-right">
                        <label className="register-label">Username :</label>
                        <input className="register-id-input" type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <label className="register-label">Email :</label>
                        <input className="register-id-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label className="register-label">Password :</label>
                        <input className="register-pass-input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="register-show">
                            <input className="register-showpass" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                            <p className="register-show-label">Show password?</p>
                        </div>
                        <div className="register-submit">
                            <Link className="register-register" to={`/login`}>Already have an account?</Link>
                            <button className="register-btn" onClick={handleRegister}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;

