import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { refreshAccessToken } from '../AuthUtils/AuthUtils';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/auth/login', { email, password });

            const { accessToken, refreshToken, role } = response.data;

            // Store tokens and role in local storage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);

            // Redirect to the dashboard or home page
            navigate('/'); 
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired, attempt to refresh
                try {
                    const newAccessToken = await refreshAccessToken(localStorage.getItem('refreshToken'));

                    // Retry the original login request with the new access token
                    const response = await axios.post('http://localhost:4001/auth/login', { email, password }, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });

                    const { accessToken, refreshToken, role } = response.data;

                    // Store tokens and role in local storage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('role', role);

                    // Redirect to the dashboard or home page
                    navigate('/');
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Handle token refresh failure (e.g., show an error message)
                }
            } else {
                console.error('Login failed:', error);
                // Handle other login failure scenarios (e.g., show an error message)
            }
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

