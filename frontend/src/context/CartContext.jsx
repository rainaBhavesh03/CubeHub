import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';

const CartContext = createContext({
    showSkeleton: true,
    cart: {},
    getCart: () => {},
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    deleteItemFromCart: () => {},
});

const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        setShowSkeleton(true);
        if(user){
            getCart().then(() => setShowSkeleton(false));
        }
        else{
            setCart(null);
            setShowSkeleton(false);
        }
    }, [user]);

    const getCart = async () => {
        try {
            const response = await axios.get("http://localhost:4001/cart/getcart", {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });
            
            setCart(response.data.userCart);
        }
        catch (error) {
            console.error(error);
        }
    };

    const addItemToCart = async (productId, quantity) => {
        try {
            const response = await axios.post("http://localhost:4001/cart/addtocart", {productId, quantity}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            setCart(response.data.userCart);
            return {status: response.status, message: response.data.message};
        } catch (error) {
            return {status: error.response.status, message: error.response.data.error};
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
            
            setCart(response.data.userCart);
            return {status: response.status, message: response.data.message};
        } catch (error) {
            return {status: error.response.status, message: error.response.data.error};
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

            setCart(response.data.userCart);
            return {status: response.status, message: response.data.message};
        } catch (error) {
            return {status: error.response.status, message: error.response.data.error};
        }
    };

    return (
        <CartContext.Provider
            value={{
                showSkeleton,
                cart,
                getCart,
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

