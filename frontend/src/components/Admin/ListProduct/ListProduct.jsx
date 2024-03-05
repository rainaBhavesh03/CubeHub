import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ListProduct.css';
import axios from 'axios';
import Clipboard from 'clipboard';
import template_image from '../../../assets/not_available.jpg';
import Cookies from 'js-cookie';

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    // const [copiedStates, setCopiedStates] = useState({});

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4001/products/allproducts', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });
            let newProductList = response.data;
            setProducts(newProductList);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);

            // handle Logout
            try {
                await axios.post('http://localhost:4001/auth/logout');

                // Clear tokens and role cookie
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('role');

                console.log('Logged out successfully');
                navigate('/login');             
            } catch (error) {
                console.error('Logout failed:', error);
            }

        } finally {
            setIsLoading(false);
        }
    }

    const handleRemoveProduct = async (productId, productName) => {
        try {
            const response = await axios.post('http://localhost:4001/products/removeproduct', { id: productId }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Refresh: `Bearer ${Cookies.get('refreshToken')}`
                }
            });
            setSuccess(response.data.success);

            await fetchProducts();
            setError(null);
            alert(`Product: ${productName}\nRemoved Succesfully!`);
        } catch (err) {
            setSuccess(null);
            setError(err.response.data.error || 'Failed to remove product');


            // handle Logout
            try {
                await axios.post('http://localhost:4001/auth/logout');

                // Clear tokens and role cookie
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('role');

                console.log('Logged out successfully');
                navigate('/login');             
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    };

    useEffect(() => {
        //const clipboard = new Clipboard('.listproduct-copy-btn');

        //clipboard.on('success', (e) => {
            //  const productId = e.trigger.id.replace('copy-btn-', '');
            //setCopiedStates({
                //  ...copiedStates,
                //[productId]: true,
                //});
            //});

        //clipboard.on('error', () => {
            // Handle error
            //  console.log("Coudn't copy!");
            //clipboard.destroy();
            //});

        //<button id={`copy-btn-${product.id}`} className={`listproduct-copy-btn ${copiedStates[product.id] ? 'copied' : ''}`} data-clipboard-text={`${product.id}`} > Copy ID </button>

            fetchProducts();
    }, []);

    return (
        <div className='listproduct'>
        <h2>All Products</h2>
        {isLoading && <p className='listproduct-msg'>Loading products...</p>}
        {error && <p className='listproduct-msg'>Error: {error}</p>}
        {products.map((product) => (
            <div key={product._id} className='listproduct-info'>
            <div className='listproduct-format'>
            <p>Name:<br/>{product.name}</p>
            <p className='listproduct-image'>
            <img
            src={
                product.images.length > 0
                ? product.images[0]
                : template_image
            }
            alt={product.name}
            />
            </p>
            <p>Types:<br/>{product.type.join(', ')}</p>
            <p>Categories:<br/>{product.category.join(', ')}</p>
            </div>

            <button id={`remove-btn-${product._id}`} className={`listproduct-remove-btn`} onClick={() => handleRemoveProduct(product._id, product.name)}>Remove</button>
            <button id={`edit-btn-${product._id}`} className={`listproduct-edit-btn`} >
            <Link to={`/admin/editproduct/${encodeURIComponent(product._id)}`}>Edit</Link>
            </button>
            </div>
        ))}
        </div>
    );
};

export default ListProduct;
