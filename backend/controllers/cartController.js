const { default: mongoose } = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

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

        res.json({ message: "Carts merged successfully", cart: userCart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart" });
    }
}

const addToCart = async (req, res) => {
    try {
        const { productIdToAdd } = req.body;
        let productToAdd = await Product.findById(productIdToAdd);
        if (!productToAdd) {
            return res.status(404).json({ message: "Product not found" });
        }

        if(productToAdd.stockQuantity === 0)
            return res.status(409).json({ message: "Product stock empty at the moment!" });

        let userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            userCart = new Cart({ userId: new mongoose.Types.ObjectId(req.userId), items: [] });
        }

        const existingItem = userCart.items.find(item => item.productId.equals(productIdToAdd));
        if (existingItem) {
            existingItem.quantity++;
        } else {
            userCart.items.push({
                productId: productToAdd._id,
                quantity: 1,
                price: productToAdd.new_price,
            });
        }

        productToAdd.stockQuantity--;
        await productToAdd.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await userCart.save();

        res.json({ message: "Item added to cart successfully", cart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart" });
    } 
};

const removeFromCart = async (req, res) => {
    try {
        const { productIdToRemove } = req.body;
        let productToRemove = await Product.findById(productIdToRemove);
        if (!productToRemove) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            return res.json({ message: "No cart found" });
        }


        const existingItem = userCart.items.find((item) => item.productId.equals(productIdToRemove));
        if (existingItem) {
            existingItem.quantity--;

            productToRemove.stockQuantity++;
            if (existingItem.quantity === 0) {
                userCart.items.splice(userCart.items.findIndex((item) => item.productId.equals(productToRemove)), 1);
            }
        }

        await productToRemove.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await userCart.save();
        res.json({ message: "Item removed from cart successfully", cart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing item from cart" });
    }
};

const deleteFromCart = async (req, res) => {
    try {
        const { productIdToDelete } = req.body;
        let productToDelete = await Product.findById(productIdToDelete);
        if (!productToDelete) {
            return res.status(404).json({ message: "Product not found" });
        }

        let userCart = await Cart.findOne({ userId: req.userId });
        if (!userCart) {
            return res.json({ message: "No cart found" });
        }

        const existingItemIndex = userCart.items.findIndex(item => item.productId.equals(productIdToDelete));
        if (existingItemIndex !== -1) {
            productToDelete.stockQuantity += userCart.items[existingItemIndex].quantity;
            userCart.items.splice(existingItemIndex, 1);
        }

        await productToDelete.save();
        userCart.grandTotal = userCart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await userCart.save();

        res.json({ message: "Item deleted from cart successfully", cart: userCart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting the item from cart" });
    }
}

module.exports = { mergeCart, addToCart, removeFromCart, deleteFromCart };
