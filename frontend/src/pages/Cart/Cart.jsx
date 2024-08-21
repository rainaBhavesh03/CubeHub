import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import CartItemDisplay from '../../components/CartItemDisplay/CartItemDisplay';
import { CartContext } from '../../context/CartContext';
import Skeleton from '../../components/Skeleton/Skeleton';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
    const navigate = useNavigate();

    const { isLoggedIn } = useContext(AuthContext);
    const { showSkeleton, cart } = useContext(CartContext);

    const handleCtnShop = () => {
        navigate('/search-results');
    };

    return (
        <div className="cart">
            {!isLoggedIn ? (
                <div className="cart-wrapper">
                    <p className="cart-message">Login to access your cart!</p>
                </div>
            ) : showSkeleton ? (
                <div className="cart-wrapper">
                    <div className="cart-left">
                        <Skeleton height={26} width={100} />
                        <CartItemDisplay />
                        <CartItemDisplay />
                    </div>
                    <div className="cart-right">
                        <div className="cart-right-wrapper">
                            <div className="cart-right-top">
                                <Skeleton height={20} width={200} />
                            </div>
                                <Skeleton height={40} width={150} />
                        </div>
                    </div>
                </div>
            ) : cart && cart.items.length > 0 ? (
                <div className="cart-wrapper">
                    <div className="cart-left">
                        <p className="cart-title">My Cart :</p>
                        {cart.items.map((item) => (
                            <CartItemDisplay key={item._id} item={item} />
                        ))}
                    </div>
                    <div className="cart-right">
                        <div className="cart-right-wrapper">
                            <div className="cart-right-top">
                                <span>Grand Total:</span><span>{cart.grandTotal}</span>
                            </div>
                            <button className="cart-right-btn" onClick={() => navigate('/checkout')}>Checkout</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="cart-wrapper">
                    <div className="cart-empty">
                        <p className="cart-empty-msg">No products in your cart!</p>
                        <button className="cart-empty-btn" onClick={handleCtnShop}>Continue to Shop</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
