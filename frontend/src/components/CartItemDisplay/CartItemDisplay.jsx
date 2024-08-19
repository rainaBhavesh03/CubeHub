import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CartItemDisplay.css';
import { CartContext } from "../../context/CartContext";
import Decimal from "decimal.js";
import Skeleton from "../Skeleton/Skeleton";

const CartItemDisplay = ({ item=null }) => {
    const [product, setProduct] = useState(null);
    const { addItemToCart, removeItemFromCart, deleteItemFromCart } = useContext(CartContext);

    const [showSkeleton, setShowSkeleton] = useState(true);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/productdetail/${item.productId}`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const updateCart = async (action, productId) => {
        if(action === "add")
            addItemToCart(productId, 1);
        if(action === "remove")
            removeItemFromCart(productId);
        if(action === "delete")
            deleteItemFromCart(productId);
    }

    useEffect(() => {
        setShowSkeleton(true);
        if(item !== null && item !== undefined)
            fetchProductDetails().then(() => setShowSkeleton(false));   
    }, [])

    return (
        <div className="cartitemdisplay">
            {showSkeleton ? (
                <div className="cartitemdisplay-wrapper">
                    <div className="cartitemdisplay-left">
                        <Skeleton height={100} width={100} />
                    </div>
                    <div className="cartitemdisplay-right">
                        <div className="cartitemdisplay-top">
                            <Skeleton height={24} width={120} />
                        </div>
                        <div className="cartitemdisplay-bottom">
                            <Skeleton height={16} width={50} />
                        </div>
                    </div>
                    <div className="cartitemdisplay-options">
                        <Skeleton height={40} width={100} />
                        <Skeleton height={20} width={50} />
                    </div>
                    <div className="cartitemdisplay-total">
                        <Skeleton height={20} width={120} />
                    </div>
                </div>
            ) : (
                <div className="cartitemdisplay-wrapper">
                    <div className="cartitemdisplay-left">
                        <Link className="cartitemdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{ currProduct: product }} >
                            <img className="cartitemdisplay-link-img" src={product.images[0]} alt='image' />
                        </Link>
                    </div>
                    <div className="cartitemdisplay-right">
                        <div className="cartitemdisplay-top">
                            <Link className="cartitemdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{currProduct: product}}  >
                                <p className="cartitemdisplay-name">{product.name}</p>
                            </Link>
                        </div>
                        <div className="cartitemdisplay-bottom">
                            <p className="cartitemdisplay-price">Price: {product.new_price}</p>
                        </div>
                    </div>
                    <div className="cartitemdisplay-options">
                        <div className="cartitemdisplay-addremove">
                            <div className="cartitemdisplay-increase" onClick={() => updateCart('add', product._id)}>+</div>
                            <div className="cartitemdisplay-quantity">{item.quantity}</div>
                            <div className="cartitemdisplay-decrease" onClick={() => updateCart('remove', product._id)}>-</div>
                        </div>
                        <p className="cartitemdisplay-delete" onClick={() => updateCart('delete', product._id)}>Remove</p>
                    </div>
                    <div className="cartitemdisplay-total">
                        <p>Total :</p>
                        <p>{new Decimal(item.quantity).mul(new Decimal(item.price)).toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartItemDisplay;
