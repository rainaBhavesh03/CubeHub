import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            navigate(`/search-results?term=${searchTerm}`);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleCartClick = async () => {
        try {
            navigate(`/cart`);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleLogin = async () => {
        try {
            navigate('/login');
        } catch (error) {
            console.error('Error navigating to login page:', error);
        }
    };


    return (
        <div className='navbar'>
            <div className='navbar-logo' onClick={() => navigate('/')}>CubeHub</div>

            {user && user.role === 'admin' && (
                <div className='navbar-admin'>
                <Link to='/admin'>Dashboard</Link>
                </div>
            )}

            <div className="navbar-search">
                <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

           
            <div className="navbar-cart" onClick={handleCartClick}>
                <svg className="navbar-cart-svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="navbar-cart-cnt">{cart ? cart.items.length : 0}</div>
            </div>

            {user ? (
                <button className='nav-btn' onClick={logout}>
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

