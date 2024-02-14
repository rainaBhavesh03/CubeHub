import React from 'react';
import { Link } from 'react-router-dom';
import './ProductsDisplay.css';

const ProductsDisplay = ({ products }) => {
    return (
        <div className="productsdisplay">
            {products.map((product) => (
                <div key={product.id} className="productsdisplay-item">
                    <div className="productsdisplay-item-container">
                        <Link to={`/product/${encodeURIComponent(product.id)}`}>
                            <img className="productsdisplay-item-image" src={product.images[0]} alt='image'/>
                        </Link>
                        {/* Add a carousel for the product images */}
                    </div>
                    <div className="productsdisplay-item-text">
                        <Link to={`/product/${encodeURIComponent(product.id)}`}>
                            <p className="productsdisplay-item-name">{product.name}</p>
                        </Link>
                        <p className="productsdisplay-item-price">{product.new_price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsDisplay;
