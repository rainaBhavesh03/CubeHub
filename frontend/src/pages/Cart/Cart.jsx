import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Cart.css';

const Cart = () => {
    const handleAddClick = async () => {
        try {
            const productIdToAdd = "65ca4672c6abfd61426f048d";

            console.log("button clicked");
            const response = await axios.post("http://localhost:4001/cart/addtocart", {productIdToAdd}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            console.log(response);
            console.log("item added");
        }
        catch (error) {
            console.error(error);
        }
    };
    const handleRemoveClick = async () => {
        try {
            const productIdToRemove = "65ca4672c6abfd61426f048d";

            console.log("button clicked");
            const response = await axios.post("http://localhost:4001/cart/removefromcart", {productIdToRemove}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            console.log(response);
            console.log("item removed");
        }
        catch (error) {
            console.error(error);
        }
    };
    const handleDeleteClick = async () => {
        try {
            const productIdToDelete = "65ca4672c6abfd61426f048d";

            console.log("button clicked");
            const response = await axios.post("http://localhost:4001/cart/deletefromcart", {productIdToDelete}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            console.log(response);
            console.log("item deleted");
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="cart-wrapper">
            <div className="cart-content">
                <button onClick={handleAddClick}>Add</button> 
                <button onClick={handleRemoveClick}>Remove</button> 
                <button onClick={handleDeleteClick}>Delete</button> 
            </div>
        </div>
    );
};

export default Cart;
