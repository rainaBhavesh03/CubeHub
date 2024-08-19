import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [tokenSent, setTokenSent] = useState(false);

    const handleForgotPassword = async () => {
        if(!email || email === undefined){
            alert('Please enter your email first!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:4001/auth/reset-passwordToken', { email });
            
            console.log(response);
            if(response){
                setTokenSent(!tokenSent);
            }
        } catch (error) {
            console.error('Error generating password reset token :', error);
        }
    };

    return (
        <div className="forgotpassword">
            <div className="forgotpassword-content">
                <div className="forgotpassword-left">
                    <p className="forgotpassword-header">Reset your CubeHub account password</p>
                </div>
                {tokenSent ? (
                    <div className="forgotpassword-token">
                        <p className="forgotpassword-tokenmessage">We have sent an email to your email id : {email}<br />Use the provided link in the mail to reset your password.</p>
                    </div>
                ) : (
                    <div className="forgotpassword-right">
                        <label className="forgotpassword-label">Email :</label>
                        <input className="forgotpassword-id-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className="forgotpassword-submit">
                            <Link className="forgotpassword-login" to={`/login`}>Remebered your password?</Link>
                            <button className="forgotpassword-btn" onClick={handleForgotPassword}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
