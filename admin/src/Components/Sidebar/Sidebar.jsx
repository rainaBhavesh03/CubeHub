import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const sidebar_current = useLocation().pathname;

    return (
        <div className='sidebar'>
            <Link to={'/addproduct'} className={`sidebar-item ${sidebar_current === '/addproduct' ? 'sidebar-active': ''} `} style={{textDecoration:'none'}}>
                <div className=''>
                    <p>Add Product</p>
                </div>
            </Link>
            <Link to={'/removeproduct'} className={`sidebar-item ${sidebar_current === '/removeproduct' ? 'sidebar-active': ''} `} style={{textDecoration:'none'}}>
                <div className=''>
                    <p>Remove Product</p>
                </div>
            </Link>
            <Link to={'/listproduct'} className={`sidebar-item ${sidebar_current === '/listproduct' ? 'sidebar-active': ''} `} style={{textDecoration:'none'}}>
                <div className=''>
                    <p>Product List</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar
