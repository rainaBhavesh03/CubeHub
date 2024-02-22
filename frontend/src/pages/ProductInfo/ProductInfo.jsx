import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import './ProductInfo.css';
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate } from "react-router-dom";

const ProductInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState(null);
    const [visibleImages, setVisibleImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const visibleImageCnt = 3;
    const breadcrumbs = useReactRouterBreadcrumbs();
    const { searchList, currProduct } = location.state;

    // Fetch search results based on the searchTerm
    async function fetchSearchResults() {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=${product.brand}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handlePreviewClick = async (image) => {
        setMainImage(image);
    }

    useEffect(() => {
        setProduct(currProduct);
    }, [currProduct]);
    useEffect(() => {
        fetchSearchResults();
    });
    useEffect(() => {
        if(product.images && product.images.length > 0)
            setMainImage(product.images[0]);
    }, [product]);
    useEffect(() => {
        if(product.images && product.images.length > 0){
            setVisibleImages(product.images.slice(startIndex, startIndex + visibleImageCnt));
        }

    }, [product, startIndex]);

    return (
        <div className="productinfo">
            <div className="productinfo-wrapper">
                <div className="productinfo-section">
                    <div className="productinfo-breadcrumb">
                        {breadcrumbs.map((crumb, index) => (
                            <p key={index}>
                                {index !== breadcrumbs.length - 1 ? (
                                    <a href={crumb.pathname}>{crumb.breadcrumb}</a>
                                ) : (
                                    <span>{product.name || crumb.breadcrumb}</span>
                                )}
                                <svg className="productinfo-breadcrumb-svg" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z"/>
                                </svg>
                            </p>
                        ))}
                    </div>
                    <div className="productinfo-content">
                        <div className="productinfo-left">
                            <div className="productinfo-carousel">
                                <div className="productinfo-carousel-main">
                                    <img className="productinfo-carousel-main-image" src={mainImage} alt="product" />
                                </div>
                                <hr className="productinfo-carousel-separator" />
                                <div className="productinfo-carousel-preview">
                                    <button
                                        className="productinfo-carousel-nav-btn"
                                        disabled={startIndex === 0}
                                        onClick={() => setStartIndex(Math.max(startIndex - visibleImageCnt, 0))}>&lt;</button>

                                    {visibleImages.map((image) => (
                                        <div className={`productinfo-carousel-preview-item ${mainImage === image ? 'productinfo-carousel-preview-set' : ''} `}>
                                            <img className="productinfo-carousel-preview-image" src={image} alt="product images preview" onClick={() => handlePreviewClick(image)} />
                                        </div>
                                    ))}
                                    
                                    <button
                                        className="productinfo-carousel-nav-btn"
                                        disabled={product.images && startIndex + visibleImageCnt >= product.images.length}
                                        onClick={() =>
                                          setStartIndex(
                                            Math.min(startIndex + visibleImageCnt, product.images.length - visibleImageCnt)
                                          )} >&gt;</button>
                                </div>
                            </div>

                            <div className="productinfo-rating">
                            </div>
                        </div>
                        <div className="productinfo-right">
                            <p className="productinfo-title">{product.name}</p>
                            <p>product ratings and stats</p>
                            <hr className="productinfo-separator" />
                            <p className="productinfo-brand" onClick={() => navigate(`/search-results?term=${product.brand}`)}>{product.brand}</p>
                            <div className="productinfo-price">
                                <span className="productinfo-price-label">Price : </span>
                                <span className="productinfo-price-new">₹ {product.new_price}</span>
                                <br/>
                                <span className="productinfo-price-label">MRP : </span>
                                <span className="productinfo-price-old">₹ {product.old_price}</span>
                            </div>
                            <div className="productinfo-stock">
                                <span className="productinfo-stock-label">Stock : </span>
                                {(product.stockQuantity > 0) ? (
                                    <span className="productinfo-stock-in">In Stock</span>
                                ) : (
                                    <span className="productinfo-stock-out">Out Of Stock</span>
                                )}
                            </div>
                            <hr className="productinfo-separator" />
                            <p>Add to cart and Checkout</p>
                            <hr className="productinfo-separator" />
                            <ReactMarkdown className="productinfo-description" remarkPlugins={remarkGfm}>{product.description}</ReactMarkdown>
                        </div>
                    </div>
                </div>


                <div className="productinfo-additional">
                    <div className="productinfo-see-more">
                    </div>

                    <div className="productinfo-search">
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductInfo;
