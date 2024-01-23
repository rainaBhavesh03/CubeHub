import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListProduct.css';
import axios from 'axios';
import Clipboard from 'clipboard';
import template_image from '../../assets/not_available.jpg'

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    // const [copiedStates, setCopiedStates] = useState({});

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:4001/products/allproducts');
            let newProductList = response.data;
            setProducts(newProductList);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRemoveProduct = async (productId, productName) => {
        try {
            const response = await axios.post('http://localhost:4001/products/removeproduct', { id: productId });
            setSuccess(response.data.success);

            await fetchProducts();
            setError(null);
            alert(`Product: ${productName}\nRemoved Succesfully!`);
        } catch (err) {
            setSuccess(null);
            setError(err.response.data.error || 'Failed to remove product');
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
                <div key={product.id} className='listproduct-info'>
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
                    
                    <button id={`remove-btn-${product.id}`} className={`listproduct-remove-btn`} onClick={() => handleRemoveProduct(product.id, product.name)}>Remove</button>
                    <button id={`edit-btn-${product.id}`} className={`listproduct-edit-btn`} >
                        <Link to={`/editproduct/${encodeURIComponent(product.id)}`}>Edit</Link>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ListProduct;
