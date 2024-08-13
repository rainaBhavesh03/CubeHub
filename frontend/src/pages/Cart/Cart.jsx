import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import CartItemDisplay from '../../components/CartItemDisplay/CartItemDisplay';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();

    const { cart } = useContext(CartContext);

    return (
        <div className="cart-wrapper">
            <div className="cart-content">
                {!cart ? (
                    <p className="cart-message">Login to access your cart!</p>
                ) : cart.items.length > 0 ? (
                    <><div className="cart-left">
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
                    </div></>
                ) : (
                    <p>No products in your cart! Continue to shop...</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
