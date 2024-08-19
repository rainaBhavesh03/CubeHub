import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../assets/RatingStars/RatingStars';
import Skeleton from '../Skeleton/Skeleton';
import './ProductsDisplay.css';

const ProductsDisplay = ({ products, showSkeleton }) => {
    return (
        <div className="productsdisplay">
            {showSkeleton ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="productsdisplay-item">
                        <Skeleton height={200} width={200}/>
                        <div className="productsdisplay-item-text">
                            <Skeleton height={18} width={100} />
                            <Skeleton height={14} width={100} />
                            <Skeleton height={16} width={50} />
                        </div>
                    </div>
                ))
            ) : (
                products.map((product) => (
                    <div key={product._id} className="productsdisplay-item">
                        <div className="productsdisplay-item-container">
                            <Link to={`/product/${product._id}`} className="productsdisplay-link">
                                <img className="productsdisplay-item-image" src={product.images[0]} alt='image' />
                            </Link>
                        </div>

                        <div className="productsdisplay-item-text">
                            <Link to={`/product/${product._id}`} className="productsdisplay-link">
                                <p className="productsdisplay-item-name">{product.name}</p>
                            </Link>
                            {product.averageRating > 0 ? (
                                <RatingStars rating={product.averageRating} />
                            ) : product.averageRating === 0 ? (
                                <p className="productsdisplay-item-review">0 Stars</p>
                            ) : (
                                <p className="productsdisplay-item-review">No reviews yet</p>
                            )}
                            <p className="productsdisplay-item-price">{product.new_price}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductsDisplay;
