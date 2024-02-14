import axios from "axios";
import React, { useEffect, useState } from "react";
import './ProductInfo.css';

const ProductInfo = () => {
    const pathname = window.location.pathname;
    const productId = pathname.split('/').pop();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState(null);
    const [visibleImages, setVisibleImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const visibleImageCnt = 3;

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
    }, [productId]);

    useEffect(() => {
        if(product.images && product.images.length > 0)
            setMainImage(product.images[startIndex]);
    }, [product]);

    useEffect(() => {
        if(product.images && product.images.length > 0){
            setVisibleImages(product.images.slice(startIndex, startIndex + visibleImageCnt));
        }
    }, [product, startIndex]);

    return (
        <div className="productinfo">
            <div className="productinfo-wrapper">
                {/* add a url nav using breadcrumbs */}
                <div className="productinfo-left">
                    <div className="productinfo-carousel">
                        <div className="productinfo-carousel-preview">
                        <button
                            className="productinfo-carousel-nav-btn"
                            disabled={startIndex === 0}
                            onClick={() => setStartIndex(Math.max(startIndex - visibleImageCnt, 0))} >Up</button>

                            {visibleImages.map((image) => (
                                <div className="productinfo-carousel-preview-item">
                                    <img className="productinfo-carousel-preview-image" src={image} alt="product images preview" onClick={() => handlePreviewClick(image)} />
                                </div>
                            ))}
                            
                        <button
                            className="productinfo-carousel-nav-btn"
                            disabled={product.images && startIndex + visibleImageCnt >= product.images.length}
                            onClick={() =>
                              setStartIndex(
                                Math.min(startIndex + visibleImageCnt, product.images.length - visibleImageCnt)
                              )} >Down</button>
                        </div>
                        <div className="productinfo-carousel-main">
                            <img className="productinfo-carousel-main-image" src={mainImage} alt="product image" />
                        </div>
                    </div>
                </div>
                <div className="productinfo-right">
                    <p className="productinfo-title">{product.name}</p>
                    
                </div>
            </div>
        </div>
    )
};

export default ProductInfo;
