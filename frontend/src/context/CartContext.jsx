import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';

const CartContext = createContext({
    cart: {},
    getCart: () => {},
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    deleteItemFromCart: () => {},
});

const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if(user)
            getCart();
        else
            setCart(null);
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
            
            setCart(response.data.userCart);
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

            setCart(response.data.userCart);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider
            value={{
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

