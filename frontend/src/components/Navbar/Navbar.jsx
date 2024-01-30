import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const isLoggedIn = () => Boolean(userRole);
    const updateRole = () => {
        const role = Cookies.get('role');
        setUserRole(role);
    };

    useEffect(() => {
        updateRole();
    }, [userRole]);

    const handleSearch = async () => {
        try {
            navigate(`/search-results?term=${searchTerm}`);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleLogin = async () => {
        try {
            navigate('/login');
        } catch (error) {
            console.error('Error navigating to login page:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4001/auth/logout');

            // Clear tokens and role cookie
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('role');

            console.log('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <div className='navbar'>
            <div className='navbar-logo' onClick={() => navigate('/')}>CubeHub</div>

            {isLoggedIn() && userRole === 'admin' && (
                <div className='navbar-admin'>
                <Link to='/admin'>Dashboard</Link>
                </div>
            )}

            <div className="search-bar">
                <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {isLoggedIn() ? (
                <button className='nav-btn' onClick={handleLogout}>
                Logout
                </button>
            ) : (
                <button className='nav-btn' onClick={handleLogin}>
                Login
                </button>
            )}
        </div>
    );
};

export default Navbar;

