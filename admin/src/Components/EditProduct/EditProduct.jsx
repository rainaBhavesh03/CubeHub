import React, { useState, useEffect } from 'react';
import './EditProduct.css';
import axios from 'axios'; 

const EditProduct = ({ productId }) => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchProductDetails() {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4001/productdetail/${productId}`);
            setProduct(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch product details. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const handleChange = (event) => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:4001/editproduct/${productId}`, product);
            setProduct(response.data.product); 
            setError(null); 
        } catch (error) {
            setError('Failed to update product');
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isLoading && <p>Loading product...</p>}
            {error && <p>Error: {error}</p>}

            <input type="text" name="name" value={product.name} onChange={handleChange} />

            <button type="submit" disabled={isLoading}>
            Edit Product
            </button>
        </form>
    );
};

export default EditProduct;

