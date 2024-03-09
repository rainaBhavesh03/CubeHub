import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';
import CartItemDisplay from '../../components/CartItemDisplay/CartItemDisplay';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);



    const getCartItems = async () => {
        try {
            const response = await axios.get("http://localhost:4001/cart/getcartitems", {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });
            
            setCartItems(response.data.cartItems);
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getCartItems();
    }, []);

    return (
        <div className="cart-wrapper">
            <div className="cart-content">
                <div className="cart-left">
                    {cartItems.length > 0 ? (
                        <div className="cart">
                            <p className="cart-title">Your Cart :</p>
                            {cartItems.map((item) => (
                                <CartItemDisplay key={item._id} item={item} getCartItems={getCartItems}/>
                            ))}
                        </div>
                    ) : (
                        <p>No products in your cart! Continue to shop...</p>
                    )}
                </div>
                <div className="cart-right">
                </div>
            </div>
        </div>
    );
};

export default Cart;
