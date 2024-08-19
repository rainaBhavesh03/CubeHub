const { default: mongoose } = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Decimal = require('decimal.js');

const mergeCart = async (req, res) => {
    try {
        const { cookieCart } = req.body;

        let userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            userCart = new Cart({ userId: new mongoose.Types.ObjectId(req.userId) });
        }

        for (const cookieItem of cookieCart) {
            const existingItem = userCart.items.find(item => item.productId.equals(cookieItem.productId));

            if (existingItem) {
                existingItem.quantity += cookieItem.quantity;
            } else {
                const product = await Product.findById(cookieItem.productId);
                userCart.items.push({
                    productId: product._id,
                    quantity: cookieItem.quantity,
                    price: product.new_price,
                });
            }
        }

        userCart.items = [...userCart.items, ...updatedItems];
        await userCart.save();

        res.status(200).json({ message: "Carts merged successfully", cartLen: userCart.items.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart" });
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let productToAdd = await Product.findById(productId);
        if (!productToAdd) {
            return res.status(404).json({ message: "Product not found" });
        }

        if(productToAdd.stockQuantity === 0)
            return res.status(409).json({ message: "Product stock empty at the moment!" });

        let userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            userCart = new Cart({ userId: new mongoose.Types.ObjectId(req.userId), items: [] });
        }

        const existingItem = userCart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            if(quantity > productToAdd.stockQuantity){
                existingItem.quantity += productToAdd.stockQuantity;
                productToAdd.stockQuantity = 0;
            }
            else{
                existingItem.quantity += quantity;
                productToAdd.stockQuantity -= quantity;
            }
        } else {
            if(quantity > productToAdd.stockQuantity){
                userCart.items.push({
                    productId: productToAdd._id,
                    quantity: productToAdd.stockQuantity,
                    price: productToAdd.new_price,
                });
                productToAdd.stockQuantity = 0;
            }
            else {
                userCart.items.push({
                    productId: productToAdd._id,
                    quantity: quantity,
                    price: productToAdd.new_price,
                });
                productToAdd.stockQuantity -= quantity;
            }
        }

        await productToAdd.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => {
            const price = new Decimal(item.price);
            const quantity = new Decimal(item.quantity);
            return acc.plus(price.mul(quantity));
        }, new Decimal(0));
        await userCart.save();

        res.status(200).json({ message: "Item added to cart successfully", userCart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart" });
    } 
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let productToRemove = await Product.findById(productId);
        if (!productToRemove) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            return res.json({ message: "No cart found" });
        }


        const existingItem = userCart.items.find((item) => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity--;

            productToRemove.stockQuantity++;
            if (existingItem.quantity === 0) {
                userCart.items.splice(userCart.items.findIndex((item) => item.productId.equals(productToRemove)), 1);
            }
        }

        await productToRemove.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => {
            const price = new Decimal(item.price);
            const quantity = new Decimal(item.quantity);
            return acc.plus(price.mul(quantity));
        }, new Decimal(0));
        await userCart.save();
        res.status(200).json({ message: "Item removed from cart successfully", userCart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing item from cart" });
    }
};

const deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        let productToDelete = await Product.findById(productId);
        if (!productToDelete) {
            return res.status(404).json({ message: "Product not found" });
        }

        let userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            return res.json({ message: "No cart found" });
        }

        const existingItemIndex = userCart.items.findIndex(item => item.productId.equals(productId));
        if (existingItemIndex !== -1) {
            productToDelete.stockQuantity += userCart.items[existingItemIndex].quantity;
            userCart.items.splice(existingItemIndex, 1);
        }

        await productToDelete.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => {
            const price = new Decimal(item.price);
            const quantity = new Decimal(item.quantity);
            return acc.plus(price.mul(quantity));
        }, new Decimal(0));
        await userCart.save();

        res.status(200).json({ message: "Item deleted from cart successfully", userCart: userCart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting the item from cart" });
    }
}

const fetchInitialCartLength = async (req, res) => {
    try {
        let userCart = await Cart.findOne({ userId: req.userId });
        if(!userCart)
            return res.json({ message: "No cart found" });

        res.status(200).json({ cartLen: userCart.items.length });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting the cart length" });
    }
}

const getCart = async (req, res) => {
    try {
        let userCart = await Cart.findOne({ userId: req.userId });
        if(!userCart)
            return res.json({ message: "No cart found" });

        res.status(200).json({ userCart: userCart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting the cart items" });
    }
}

module.exports = { mergeCart, addToCart, removeFromCart, deleteFromCart, fetchInitialCartLength, getCart };
