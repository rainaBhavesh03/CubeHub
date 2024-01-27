import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const sidebar_current = useLocation().pathname;

    return (
        <div className='sidebar'>
            <Link to={'/admin/addproduct'} className={`sidebar-item ${sidebar_current === '/admin/addproduct' ? 'sidebar-active': ''} `} style={{textDecoration:'none'}}>
                <div className=''>
                    <p>Add Product</p>
                </div>
            </Link>
            <Link to={'/admin/listproduct'} className={`sidebar-item ${sidebar_current === '/admin/listproduct' ? 'sidebar-active': ''} `} style={{textDecoration:'none'}}>
                <div className=''>
                    <p>Product List</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar
