import React from 'react';
import { Link } from 'react-router-dom';
import './ProductsDisplay.css';

const ProductsDisplay = ({ products, fromSearch }) => {
    return (
        <div className="productsdisplay">
            {products.map((product) => (
                <div key={product._id} className={`productsdisplay-item ${fromSearch ? "productsdisplay-item-fromSearch" : "productsdisplay-item-notFromSearch"}`}>
                    <div className="productsdisplay-item-container">
                        <Link className="productsdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{currProduct: product}}  >
                            <img className="productsdisplay-item-image" src={product.images[0]} alt='image'/>
                        </Link>
                    </div>

                    <div className="productsdisplay-item-text">
                        <Link className="productsdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{currProduct: product}}  >
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
