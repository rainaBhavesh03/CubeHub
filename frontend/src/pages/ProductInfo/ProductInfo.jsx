import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import './ProductInfo.css';
import remarkGfm from 'remark-gfm';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductsDisplay from "../../components/ProductsDisplay/ProductsDisplay";
import { CartContext } from "../../context/CartContext";
import RatingStars from "../../assets/RatingStars/RatingStars";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

const ProductInfo = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [mainImage, setMainImage] = useState(null);
    const [visibleImages, setVisibleImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [brandSearchResults, setBrandSearchResults] = useState([]);
    const visibleImageCnt = 3;
    const breadcrumbs = useReactRouterBreadcrumbs();
    const { productId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { verifyUser, user } = useContext(AuthContext);
    const { addItemToCart } = useContext(CartContext);

    const handleAddToCart = async (productId, quantity) => {
        try{
            const userResponse = await axios.get('http://localhost:4001/auth/getuserdetails', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
            }});

            console.log(userResponse.status);

            if(userResponse.status === 200){
                addItemToCart(productId, quantity).then(() => { fetchProductDetails() });
            }
            else
                console.log(userResponse.data);
        }
        catch (err){
            if(err.response.status === 401){
                alert('Please login first!');
            }
            else if(err.response.status === 403){
                console.log('tokens expired');
                navigate('login');
            }
        }
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

            setProduct(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        try {
            if(productId){
                fetchProductDetails();

                fetchAllReviews();

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error(err, "Couldn't fetch the product details");
        }
    }, [productId]);

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


    const fetchAllReviews = async () => {
        try{
            const response = await axios.get(`http://localhost:4001/review/allreviewsbyproduct/${productId}`);

            setReviews(response.data.reviews);
        }
        catch (error) {
            console.error("Error fetching all ", error);
        }
    };

    const handleAddReview = async () => {
        try {
            if(rating > 5 || rating < 0){
                alert("Invalid rating entered!!");
                setRating(0);
                return;
            }
            
            const data = {
                userId: user._id,
                productId: productId,
                comment: comment,
                stars: rating,
            };

            const response = await axios.post('http://localhost:4001/review/addreview', data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }});

            if(response.status === 200){
                fetchAllReviews();
                fetchProductDetails();
            }
            
            setComment("");
            setRating(0);

        }
        catch (error) {
            console.error("Error while adding a review:", error);
            alert("Please log in");
        }
    }

    const handleDeleteReview = async (review) => {
        try{
            const userId = review.userId._id;
            const data = {
                productId: productId,
                userId: userId, // id of the user that created the review
                reviewId: review._id,
            };

            const res = await axios.post('http://localhost:4001/review/deletereview', data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`,
            }});

            fetchProductDetails();
            fetchAllReviews();

            if(res.status === 200)
            alert("Your review has been deleted!");
        }
        catch (error) {
            console.error("Error deleting the review", error);
        }
    }

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

                                    {visibleImages.map((image, index) => (
                                        <div key={index} className={`productinfo-carousel-preview-item ${mainImage === image ? 'productinfo-carousel-preview-set' : ''} `}>
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

                            <div className="productinfo-review-wrapper">
                                <div className="productinfo-review-top">
                                    <label className="productinfo-review-label">Rating: </label>
                                    <input className="productinfo-review-rating" type="text" inputMode="numeric" placeholder="0" required min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
                                    <br/>
                                    <input className="productinfo-review-input" required placeholder="Add your review..." value={comment} onChange={(e) => setComment(e.target.value)}/>
                                    <button className="productinfo-review-btn" onClick={handleAddReview} >Add</button>
                                </div>

                                {!reviews || reviews.length === 0 ? (<p>Be the first one to add a review!</p>) : (
                                <div className="productinfo-review-bottom">
                                    {reviews.map((review, index) => (
                                        <div className="productinfo-review" key={index}>
                                            <div className="productinfo-review-details">
                                                <div className="productinfo-review-details-header">
                                                    {review.userId.username + ' ' + review.stars + '/5'}
                                                    <RatingStars rating={review.stars} />
                                                </div>
                                                <button className="productinfo-review-menu" onClick={() => handleDeleteReview(review)} >
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4ZM15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5ZM12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19ZM12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z"
                                                            fill="#000000"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="productinfo-review-comment">{review.comment}</p>
                                            <span>CreatedAt: {review.createdAt}</span>
                                        </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="productinfo-right">
                            <p className="productinfo-title">{product.name}</p>
                            {product.averageRating > 0 ?
                                (<><RatingStars rating={product.averageRating} /><p>{product.averageRating} stars out of {product.totalReviews} reviews</p></>) :
                                product.totalReviews !== 0 ?
                                (<p>{product.averageRating} stars out of {product.totalReviews} reviews</p>) :
                                (<p>No reviews yet</p>)
                            }
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


                {brandSearchResults.length > 0 ? (
                <div className="productinfo-more">
                    <p className="productinfo-more-title">Products from the same brand :</p>
                    <ProductsDisplay products={brandSearchResults} fromSearch={false} />
                </div>
                ) : (<><p className="productinfo-more-title">No more products to show</p></>)}
            </div>
        </div>
    )
};

export default ProductInfo;
