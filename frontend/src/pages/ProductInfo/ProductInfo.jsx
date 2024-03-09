import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import './ProductInfo.css';
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductsDisplay from "../../components/ProductsDisplay/ProductsDisplay";
import { CartContext } from "../../context/CartContext";

const ProductInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState(null);
    const [visibleImages, setVisibleImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [brandSearchResults, setBrandSearchResults] = useState([]);
    const visibleImageCnt = 3;
    const breadcrumbs = useReactRouterBreadcrumbs();
    const { productId } = useParams();
    let { currProduct } = (location.state === null) ? { currProduct: null } : location.state;
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { addItemToCart } = useContext(CartContext);

    const handleAddToCart = async (productId, quantity) => {
        addItemToCart(productId, quantity).then(() => {fetchProductDetails().then((data) => setProduct(data)) });
    };


    const ProductInfo_Modal = () => {
        return (
            <div className="productinfo-modal" onClick={() => handleZoomIn()}>
                <div className="productinfo-modal-content" onClick={(event) => event.stopPropagation()}>
                    <div className="productinfo-modal-main">
                        <img className="productinfo-modal-image" src={mainImage} alt="main image modal" />
                    </div>
                    <div className="productinfo-modal-close">
                        <p onClick={() => handleZoomIn()}>X</p>
                    </div>
                </div>
            </div>
        )
    };
    const handleZoomIn = () => {
        setShowModal(!showModal);
    }
    async function fetchProductDetails() {
        try {
            const response = await axios.get(`http://localhost:4001/products/productdetail/${productId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    useEffect(() => {
        if (currProduct === null) {
            try {
                currProduct = fetchProductDetails();

                currProduct.then((data) => {
                    currProduct = data;

                    setProduct(currProduct);
                }).catch((err) => {
                    console.error(err, "Couldn't resolve the promise");
                });
            } catch (err) {
                console.error(err, "Couldn't fetch the product details");
            }
        }

        setProduct(currProduct);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currProduct]);

    async function fetchBrandSearchResults() {
        try {
            const response = await axios.get(`http://localhost:4001/products/search?term=${product.brand}`);
            setBrandSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handlePreviewClick = async (image) => {
        setMainImage(image);
    }

    useEffect(() => {
        if(product.brand){
            fetchBrandSearchResults();
        }
    }, [product]);
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
            {showModal && (<ProductInfo_Modal />)}
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
                                    <img className="productinfo-carousel-main-image" src={mainImage} onClick={() => handleZoomIn(mainImage)} alt="product" />
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
                            <div className="productinfo-quantity">
                                <label className="productinfo-quantity-label">Quantity: </label>
                                <input disabled={product.stockQuantity === 0} className="productinfo-quantity-input" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <button disabled={product.stockQuantity === 0} className="productinfo-addtocart" onClick={() => handleAddToCart(product._id, quantity)}>Add to Cart</button>
                            <hr className="productinfo-separator" />
                            <ReactMarkdown className="productinfo-description" remarkPlugins={remarkGfm}>{product.description}</ReactMarkdown>
                        </div>
                    </div>
                </div>


                <div className="productinfo-more">
                    <p className="productinfo-more-title">Products from the same brand :</p>
                    <ProductsDisplay products={brandSearchResults} fromSearch={false} />
                </div>
            </div>
        </div>
    )
};

export default ProductInfo;
