import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(!email || email === undefined || !password || password === undefined ){
            alert('Please enter all details!');
            return;
        }
        try {
            login({ email, password });

            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login">
            {isLoading ? (<p>LOADING...</p>) : (
                <div className="login-content">
                    <div className="login-left">
                        <p className="login-header">Sign in</p>
                        <p className="login-text">Sign in into your CubeHub account</p>
                    </div>
                    <div className="login-right">
                        <label className="login-label">Email or Username :</label>
                        <input className="login-id-input" type="email or username" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label className="login-label">Password :</label>
                        <input className="login-pass-input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="login-show">
                            <input className="login-showpass" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                            <p className="login-show-label">Show password?</p>
                        </div>
                        <div className="login-submit">
                            <Link className="login-register" to={`/forgot-password`}>Forgot password?</Link>
                        </div>
                        <div className="login-submit">
                            <Link className="login-register" to={`/register`}>Not registered?</Link>
                            <button className="login-btn" onClick={handleLogin}>Sign in</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

