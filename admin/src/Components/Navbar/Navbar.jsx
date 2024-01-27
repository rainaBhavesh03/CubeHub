import React from "react";
import './Navbar.css'
import navlogo from '../../assets/logo.png'
import navProfile from '../../assets/nav-profile.svg'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            
        } catch (error) {

        }
    };

    return (
        <div className='navbar'>
            <img src={navlogo} alt='' className='nav-logo' />
        {/*<img src={navProfile} alt='' className='nav-profile' />*/}

            <button onClick={handleLogout}>Logout</button> 
        </div>
    )
}

export default Navbar
