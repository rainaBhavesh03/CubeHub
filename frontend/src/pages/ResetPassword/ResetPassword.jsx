import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleToken = async () => {
        if(!password || password === undefined || !confirmPassword || confirmPassword === undefined){
            alert('Please enter all details!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:4001/auth/reset-password', { password, confirmPassword, token }); 

            if(response){
                alert('User password has been reset!');

                navigate('/login');
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="resetpassword">
            <div className="resetpassword-content">
                <div className="resetpassword-left">
                    <p className="resetpassword-header">Reset your CubeHub account password</p>
                </div>
                <div className="resetpassword-right">
                    <label className="resetpassword-label">New password :</label>
                    <input className="resetpassword-pass-input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="resetpassword-show">
                        <input className="resetpassword-showpass" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        <p className="resetpassword-show-label">Show password?</p>
                    </div>
                    <label className="resetpassword-label">Confirm new password :</label>
                    <input className="resetpassword-pass-input" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <div className="resetpassword-show">
                        <input className="resetpassword-showpass" type="checkbox" checked={showConfirmPassword} onChange={() => setShowConfirmPassword(!showConfirmPassword)} />
                        <p className="resetpassword-show-label">Show confirm password?</p>
                    </div>
                    <div className="resetpassword-submit">
                        <Link className="resetpassword-login" to={`/login`}>Remebered your password?</Link>
                        <button className="resetpassword-btn" onClick={handleToken}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

