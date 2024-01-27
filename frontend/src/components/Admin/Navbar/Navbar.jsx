import React from "react";
import axios from 'axios';
import './Navbar.css';
import navlogo from '../../../assets/logo.png'
import navProfile from '../../../assets/nav-profile.svg'
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
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
        <div className='adminnavbar'>
            <Link to={'/admin'}><img src={navlogo} alt='' className='adminnav-logo' /></Link>
        {/*<img src={navProfile} alt='' className='nav-profile' />*/}

            <button className='adminnav-btn' onClick={handleLogout}>Logout</button> 
        </div>
    )
}

export default Navbar
