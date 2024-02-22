import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import './ProductInfo.css';
import remarkGfm from 'remark-gfm';

const ProductInfo = () => {
    const pathname = window.location.pathname;
    const productId = pathname.split('/').pop();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState(null);
    const [visibleImages, setVisibleImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const visibleImageCnt = 3;
    const breadcrumbs = useReactRouterBreadcrumbs();
    
    async function fetchProductDetails() {
        try {
            const response = await axios.get(`http://localhost:4001/products/productdetail/${productId}`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const handlePreviewClick = async (image) => {
        setMainImage(image);
    }

    useEffect(() => {
        fetchProductDetails();
    }, []);

    useEffect(() => {
        if(product.images && product.images.length > 0)
            setMainImage(product.images[startIndex]);
    },[product, startIndex]);

    useEffect(() => {
        if(product.images && product.images.length > 0){
            setVisibleImages(product.images.slice(startIndex, startIndex + visibleImageCnt));
        }

    }, [product, startIndex]);

    return (
        <div className="productinfo">
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
                <div className="productinfo-wrapper">
                    <div className="productinfo-left">
                        <div className="productinfo-carousel">
                            <div className="productinfo-carousel-main">
                                <img className="productinfo-carousel-main-image" src={mainImage} alt="product" />
                            </div>
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
                    </div>
                    <div className="productinfo-right">
                        <p className="productinfo-title">{product.name}</p>
                        <p>product ratings and stats</p>
                        <div className="productinfo-price">
                            <p className="productinfo-price-old">{product.old_price}</p>
                            <p className="productinfo-price-new">{product.new_price}</p>
                        </div>
                        <div className="productinfo-info">
                            <p className="productinfo-info-brand">{product.brand}</p>
                        </div>
                        <ReactMarkdown className="productinfo-description" remarkPlugins={remarkGfm}>{product.description}</ReactMarkdown>
                    </div>
                </div>
            </div>



            <div className="productinfo-see-more">
                {/* create a separate see more component and pass the current product's brand and also the search result's product list to it. */}
            </div>
        </div>
    )
};

export default ProductInfo;
