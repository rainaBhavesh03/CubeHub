import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../assets/RatingStars/RatingStars';
import './ProductsDisplay.css';

const ProductsDisplay = ({ products, fromSearch }) => {
    return (
        <div className="productsdisplay">
            {products.map((product) => (
                <div key={product._id} className={`productsdisplay-item ${fromSearch ? "productsdisplay-item-fromSearch" : "productsdisplay-item-notFromSearch"}`}>
                    <div className="productsdisplay-item-container">
                        <Link to={`/product/${product._id}`} className="productsdisplay-link">
                            <img className="productsdisplay-item-image" src={product.images[0]} alt='image'/>
                        </Link>
                    </div>

                    <div className="productsdisplay-item-text">
                        <Link to={`/product/${product._id}`} className="productsdisplay-link">
                            <p className="productsdisplay-item-name">{product.name}</p>
                        </Link>
                        {product.averageRating > 0 ? (<RatingStars rating={product.averageRating} />) : product.averageRating === 0 ? (<p className="productsdisplay-item-review">0 Stars</p>) : (<p className="productsdisplay-item-review">No reviews yet</p>)}
                        <p className="productsdisplay-item-price">{product.new_price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsDisplay;

