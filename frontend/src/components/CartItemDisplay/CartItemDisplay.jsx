import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CartItemDisplay.css';
import { CartContext } from "../../context/CartContext";

const CartItemDisplay = ({ item, getCartItems }) => {
    const [product, setProduct] = useState({});
    const { addItemToCart, removeItemFromCart, deleteItemFromCart } = useContext(CartContext);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/products/productdetail/${item.productId}`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const updateCart = async (action, productId) => {
        if(action === "add")
            addItemToCart(productId, 1).then(() => getCartItems());
        if(action === "remove")
            removeItemFromCart(productId).then(() => getCartItems());
        if(action === "delete")
            deleteItemFromCart(productId).then(() => getCartItems());
    }

    useEffect(() => {
        fetchProductDetails();   
    }, [])

    return (
        <>
            {Object.keys(product).length > 0 ? (
                <div key={product._id} className="cartitemdisplay">
                    <div className="cartitemdisplay-left">
                        <Link className="cartitemdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{ currProduct: product }} >
                            <img className="cartitemdisplay-link-img" src={product.images[0]} alt='image' />
                        </Link>
                    </div>
                    <div className="cartitemdisplay-right">
                        <div className="cartitemdisplay-top">
                            <Link className="cartitemdisplay-link" to={`/product/${encodeURIComponent(product._id)}`} state={{currProduct: product}}  >
                                <p className="cartitemdisplay-name">{product.name}</p>
                            </Link>
                        </div>
                        <div className="cartitemdisplay-bottom">
                            <p className="cartitemdisplay-price">Price: {product.new_price}</p>
                        </div>
                    </div>
                    <div className="cartitemdisplay-options">
                        <div className="cartitemdisplay-addremove">
                            <div className="cartitemdisplay-increase" onClick={() => updateCart('add', product._id)}>+</div>
                            <div className="cartitemdisplay-quantity">{item.quantity}</div>
                            <div className="cartitemdisplay-decrease" onClick={() => updateCart('remove', product._id)}>-</div>
                        </div>
                        <p className="cartitemdisplay-delete" onClick={() => updateCart('delete', product._id)}>Remove</p>
                    </div>
                    <div className="cartitemdisplay-total">
                        <p>Total :</p>
                        <p>{item.quantity * item.price}</p>
                    </div>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </>
    )
}

export default CartItemDisplay;
