import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log(localStorage.getItem('accessToken'));
            // Make a request to the logout API
            await axios.post('http://localhost:4001/auth/logout', null, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });

            // Clear tokens from local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');

            console.log('logged out');
            // Redirect to the login page or home page
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
        <h2>Logout</h2>
        <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;

