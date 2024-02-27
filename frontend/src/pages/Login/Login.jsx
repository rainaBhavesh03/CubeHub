import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/login', { email, password });

            const { accessToken, refreshToken, role } = response.data;

            // Store tokens and role in cookies
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);
            Cookies.set('role', role);

            // Trigger update in Navbar component
            window.dispatchEvent(new Event('userLoggedIn'));

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login">
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
        </div>
    );
};

export default Login;

