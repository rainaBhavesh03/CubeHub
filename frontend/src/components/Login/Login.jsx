import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/login', { email, password });

            const { role } = response.data;

            // Save the token in local storage or cookies
            if(response.data.token){
                document.cookie = `token=${response.data.token}; HttpOnly; Secure`;
            }

            if (role === 'admin') {
                window.location.href = 'http://localhost:5173';
            } else {
                navigate('/'); // Redirect to landing page
            }
        } catch (error) {
            console.error('Error logging in:', error);
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

