import React, { useState } from 'react';
import './RemoveProduct.css';
import axios from 'axios';

const RemoveProduct = () => {
  const [productId, setProductId] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setProductId(e.target.value);
  };

  const handleRemoveProduct = async () => {
    try {
      const response = await axios.post('http://localhost:4001/removeproduct', { id: productId });
      setSuccess(response.data.success);
      setError(null);
    } catch (err) {
      setSuccess(null);
      setError(err.response.data.error || 'Failed to remove product');
    }
  };

  return (
    <div className='removeproduct'>
      <div className='removeproduct-field'>
        <label>
          Product ID
          <input type="text" value={productId} placeholder='Enter product id here' onChange={handleInputChange} />
        </label>
        <button className='removeproduct-btn' onClick={handleRemoveProduct}>Remove Product</button>
      </div>
      {success && <p className='removeproduct-msg'>Product removed successfully: {success}</p>}
      {error && <p className='removeproduct-msg'>Error: {error}</p>}
    </div>
  );
};

export default RemoveProduct;
