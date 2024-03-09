import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CartContext = createContext({
    totalItems: 0,
    fetchInitialCartLength: () => {},
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    deleteItemFromCart: () => {},
});

const CartProvider = ({ children }) => {
    const [totalItems, setTotalItems] = useState(0);

    const updateCartAndTriggerRender = async (newTotalItems) => {
        setTotalItems(newTotalItems);
    };

    const fetchInitialCartLength = async () => {
        try {
            const response = await axios.get("http://localhost:4001/cart/initiallength", {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            updateCartAndTriggerRender(response.data.cartLen);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInitialCartLength();
    }, []);

    const addItemToCart = async (productId, quantity) => {
        try {
            const response = await axios.post("http://localhost:4001/cart/addtocart", {productId, quantity}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            updateCartAndTriggerRender(response.data.cartLen);
        } catch (error) {
            console.error(error);
        }
    };

    const removeItemFromCart = async (productId) => {
        try {
            const response = await axios.post("http://localhost:4001/cart/removefromcart", {productId}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });
            
            updateCartAndTriggerRender(response.data.cartLen);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteItemFromCart = async (productId) => {
        try {
            const response = await axios.post("http://localhost:4001/cart/deletefromcart", {productId}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            updateCartAndTriggerRender(response.data.cartLen);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                totalItems,
                fetchInitialCartLength,
                addItemToCart,
                removeItemFromCart,
                deleteItemFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };

