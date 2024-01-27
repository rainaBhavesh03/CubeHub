import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EditProduct.css';
import axios from 'axios';

const EditProduct = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchProductDetails() {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4001/products/productdetail/${productId}`);
            setProduct(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch product details. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const response = await axios.get('http://localhost:4001/categories/categories');
            const newCategories = response.data;
            setCategories(newCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function fetchTypes() {
        try {
            const response = await axios.get('http://localhost:4001/types/types');
            const newTypes = response.data;
            setTypes(newTypes);
        } catch (error) {
            console.error('Error fetching Types:', error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
        fetchCategories();
        fetchTypes();
    }, [productId]);

    const handleChange = (event) => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };

    const handleCategoryChange = (categoryId) => {
        setProduct({
            ...product,
            category: product.category.includes(categoryId)
                ? product.category.filter((id) => id !== categoryId)
                : [...product.category, categoryId],
        });
    };

    const handleTypeChange = (typeId) => {
        setProduct({
            ...product,
            type: product.type.includes(typeId)
                ? product.type.filter((id) => id !== typeId)
                : [...product.type, typeId],
        });
    };

    const handleAddImage = () => {
        setProduct({ ...product, images: [...product.images, ''] });
    };

    const handleRemoveImage = (indexToRemove) => {
        setProduct({
            ...product,
            images: product.images.filter((_, index) => index !== indexToRemove),
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:4001/products/editproduct/${productId}`, product);
            setProduct(response.data.product);
            setError(null);
            alert(`Product ${product.name} edited successfully!`);
        } catch (error) {
            setError('Failed to update product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='edit-product'>
            <Link to={`/admin/listproduct`} className="editproduct-back">Back</Link>
            {isLoading && <p>Loading product...</p>}
            {error && <p>Error: {error}</p>}

            <div className='editproduct-itemfield'>
                <p>Product title</p>
                <input
                    className="editproduct-input"
                    type='text'
                    name='name'
                    placeholder='Enter product title here'
                    value={product.name}
                    onChange={handleChange}
                />
            </div>

            <div className='editproduct-price'>
                <div className='editproduct-itemfield'>
                    <p>Old Price</p>
                    <input className="editproduct-input" type='text' name='old_price' placeholder='Enter old price here' value={product.old_price} onChange={handleChange}/>
                </div>
                <div className='editproduct-itemfield'>
                    <p>New Price</p>
                    <input className="editproduct-input" type='text' name='new_price' placeholder='Enter new price here' value={product.new_price} onChange={handleChange}/>
                </div>
            </div>

            <div className='editproduct-itemfield'>
                <p>Product Categories</p>
                <div className='editproduct-options'>
                    {categories.map((category) => (
                        <div key={category._id}>
                            <input
                                type="checkbox"
                                id={`category-${category._id}`}
                                value={category._id}
                                className='editproduct-checkbox'
                                checked={product.category && product.category.includes(category._id)}
                                onChange={() => handleCategoryChange(category._id)}
                            />
                            <label htmlFor={`category-${category._id}`}>{category.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className='editproduct-itemfield'>
                <p>Product Types</p>
                <div className='editproduct-options'>
                    {types.map((type) => (
                        <div key={type._id}>
                            <input
                                type="checkbox"
                                id={`type-${type._id}`}
                                value={type._id}
                                className='editproduct-checkbox'
                                checked={product.type && product.type.includes(type._id)}
                                onChange={() => handleTypeChange(type._id)}
                            />
                            <label htmlFor={`type-${type._id}`}>{type.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className='editproduct-itemfield'>
                <p>Product Brand</p>
                <input
                    className="editproduct-input"
                    type='text'
                    name='brand'
                    placeholder='Enter product brand'
                    value={product.brand}
                    onChange={handleChange}
                />
            </div>

            <div className='editproduct-itemfield'>
                <p>Product Description</p>
                <input
                    className="editproduct-input"
                    type='text'
                    name='description'
                    placeholder='Enter product description'
                    value={product.description}
                    onChange={handleChange}
                />
            </div>

            <div className="editproduct-itemfield">
                <p>Product Images</p>
                {product.images &&
                    product.images.map((imageUrl, index) => (
                        <div key={index} className='editproduct-image'>
                            <input
                                className="editproduct-image-input"
                                type="text"
                                name={`images[${index}]`}
                                placeholder="Enter image URL"
                                value={imageUrl}
                                onChange={(e) => setProduct({
                                    ...product,
                                    images: [
                                        ...product.images.slice(0, index),
                                        e.target.value,
                                        ...product.images.slice(index + 1),
                                    ],
                                })}
                            />
                            <div className="editproduct-close-btn" onClick={() => handleRemoveImage(index)}>x</div>
                        </div>
                    ))}
                <div className='editproduct-image-btn' onClick={handleAddImage}>Add Image</div>
            </div>

            <div className='editproduct-itemfield'>
                <p>Product Stock Quantity</p>
                <input
                    className="editproduct-input"
                    type='number'
                    name='stockQuantity'
                    placeholder='Enter product stock quantity'
                    value={product.stockQuantity}
                    onChange={handleChange}
                />
            </div>

            <button className='editproduct-btn' type="submit" disabled={isLoading}>
                Edit Product
            </button>
        </form>
    );
};

export default EditProduct;

