import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import  './AddProduct.css';
import Cookies from 'js-cookie';
import MDEditor from '@uiw/react-md-editor';

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('**this is a test**');
    const [quantity, setQuantity] = useState('');

    async function fetchCategories() {
        try {
            const response = await axios.get('http://localhost:4001/categories/categories');
            const newCategories = response.data;
            setCategories(newCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    async function fetchTypes() {
        try {
            const response = await axios.get('http://localhost:4001/types/types');
            const newTypes = response.data;
            setTypes(newTypes);
        } catch (error) {
            console.error("Error fetching Types:", error);
        }
    }

    useEffect(() => {
        fetchCategories();  
        fetchTypes();  
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((selectedCategories) => {
            const index = selectedCategories.indexOf(categoryId);

            if (selectedCategories.length === 0) {
                return [categoryId];
            }
            else if (index !== -1) {
                return [...selectedCategories.slice(0, index), ...selectedCategories.slice(index + 1)];
            } else {
                return [...selectedCategories, categoryId];
            }
        });
    };

    const handleTypeChange = (typeId) => {
        setSelectedTypes((selectedTypes) => {
            const index = selectedTypes.indexOf(typeId);

            if (selectedTypes.length === 0) {
                return [typeId];
            }
            else if (index !== -1) {
                return [...selectedTypes.slice(0, index), ...selectedTypes.slice(index + 1)];
            } else {
                return [...selectedTypes, typeId];
            }
        });
    };

    const handleAddImage = () => {
        setImages([...images, '']);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            name: title,
            types: selectedTypes,
            brand: brand,
            description: description,
            images: images, // images state holds an array of URLs
            categories: selectedCategories,
            new_price: newPrice,
            old_price: oldPrice,
            stockQuantity: quantity
        };

        try {
            const response = await axios.post('http://localhost:4001/products/addproduct', data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });

            alert(`Product ${response.data.name} was added successfully!`);

            setTitle('');
            setOldPrice('');
            setNewPrice('');
            setBrand('');
            setDescription('');
            setImages([]);
            setQuantity('');
            setSelectedCategories([]);
            setSelectedTypes([]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='add-product'>
            <div className='addproduct-itemfield'>
                <p>Product title</p>
                <input className="addproduct-input" type='text' name='name' placeholder='Enter product title here' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='addproduct-price'>
                <div className='addproduct-itemfield'>
                    <p>Old Price</p>
                    <input className="addproduct-input" type='number' name='old_price' placeholder='Enter old price here' value={oldPrice} onChange={(e) => setOldPrice(e.target.value)}/>
                </div>
                <div className='addproduct-itemfield'>
                    <p>New Price</p>
                    <input className="addproduct-input" type='number' name='new_price' placeholder='Enter new price here' value={newPrice} onChange={(e) => setNewPrice(e.target.value)}/>
                </div>
            </div>
            <p className='add-product-comment'>(Use Ctrl or Command btn to select multiple options)</p>
            <div className="addproduct-itemfield">
                <p>Product Categories</p>
                <div  className='addproduct-options'>
                    {categories.map((category) => (
                        <div key={category._id}>
                            <input
                            type="checkbox"
                            id={`category-${category._id}`}
                            value={category._id}
                            className='addproduct-checkbox'
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleCategoryChange(category._id)}
                            />
                            <label htmlFor={`category-${category._id}`}>{category.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <p className='add-product-comment'>(Use Ctrl or Command btn to select multiple options)</p>
            <div className="addproduct-itemfield">
                <p>Product Types</p>
                <div  className='addproduct-options'>
                    {types.map((type) => (
                        <div key={type._id}>
                            <input
                            type="checkbox"
                            id={`type-${type._id}`}
                            value={type._id}
                            className='addproduct-checkbox'
                            checked={selectedTypes.includes(type._id)}
                            onChange={() => handleTypeChange(type._id)}
                            />
                            <label htmlFor={`type-${type._id}`}>{type.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Brand</p>
                <input className="addproduct-input" type='text' name='brand' placeholder='Enter product brand' value={brand} onChange={(e) => setBrand(e.target.value)}/>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Description</p>
                <div className="addproduct-description"  data-color-mode="light">
                    <MDEditor
                        value={description}
                        onChange={setDescription}
                        
                      />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Images</p>
                {images.map((imageUrl, index) => (
                    <div key={index} className='addproduct-image'>
                        <input
                        className="addproduct-image-input"
                        type="url"
                        name={`imageUrl[${index}]`}
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImages((prevImages) => [...prevImages.slice(0, index), e.target.value, ...prevImages.slice(index + 1)])}
                        />
                        <div className="addproduct-close-btn" onClick={() => handleRemoveImage(index)}>x</div>
                    </div>
                ))}
                <div className='addproduct-image-btn' onClick={handleAddImage}>Add Image</div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Stock Quantity</p>
                <input className="addproduct-input" type='number' name='stockQuantity' placeholder='Enter product stock quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
            </div>

            <button className='addproduct-btn' type='submit'>Add Product</button>
        </form>
    )
}

export default AddProduct
