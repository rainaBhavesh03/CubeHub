import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsDisplay.css';

const ProductsDisplay = ({ products, fromSearch }) => {
    const navigate = useNavigate();
    
    const handleClick = (productId) => {
        navigate(`/product/${productId}`);
    }

    return (
        <div className="productsdisplay">
            {products.map((product) => (
                <div key={product._id} className={`productsdisplay-item ${fromSearch ? "productsdisplay-item-fromSearch" : "productsdisplay-item-notFromSearch"}`}>
                    <div className="productsdisplay-item-container">
                        <div className="productsdisplay-link" onClick={() => handleClick(product._id)} >
                            <img className="productsdisplay-item-image" src={product.images[0]} alt='image'/>
                        </div>
                    </div>

                    <div className="productsdisplay-item-text">
                        <div className="productsdisplay-link" onClick={() => handleClick(product._id)} >
                            <p className="productsdisplay-item-name" onClick={() => handleClick(product._id)} >{product.name}</p>
                        </div>
                        <p className="productsdisplay-item-price">{product.new_price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsDisplay;
