const { default: mongoose } = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity,  } = req.body;


        await cart.save();

        res.json({ message: "Item added to cart successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart" });
    } 
};

const removeFromCart = async (req, res) => {

};

module.exports = { addToCart, removeFromCart };
