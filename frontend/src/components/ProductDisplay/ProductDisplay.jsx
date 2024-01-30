import React from 'react';
import './ProductDisplay.css';

const ProductDisplay = ({ products }) => {
  return (
    <div className="product-display">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductDisplay;
