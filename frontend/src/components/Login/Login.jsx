import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/login', { email, password });

            const { accessToken, refreshToken, role } = response.data;

            // Store tokens and role in cookies
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);
            Cookies.set('role', role);

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/'); // Redirect to the landing page
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Handle other login failure scenarios (e.g., show an error message)
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <Link to={`/register`}>Not registered?</Link>
        </div>
    );
};

export default Login;

