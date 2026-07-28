import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProductCard = ({ product }) => {
  const { productId, name, description, price, stock, category, images } = product;
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  const imageUrl = images && images.length > 0 
    ? images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
    
  const categoryName = category ? category.categoryName : 'Uncategorized';
  
  let stockClass = 'stock-indicator ';
  if (stock === 0) stockClass += 'out';
  else if (stock < 20) stockClass += 'low';
  else stockClass += 'in';

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    setAdding(true);
    try {
      const user = JSON.parse(userStr);
      await api.post('/cart/add', {
        userId: user.id,
        productId: productId,
        quantity: 1
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert('Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card premium-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={name} className="product-image" />
        <span className="category-badge">{categoryName}</span>
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        
        <div className="product-footer">
          <span className="product-price">₹{price.toLocaleString()}</span>
          <span className="product-stock">
            <span className={stockClass}></span>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <button 
          className={`btn btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
          disabled={stock === 0 || adding}
          onClick={handleAddToCart}
          style={{ width: '100%', marginTop: '15px' }}
        >
          {adding ? 'Adding...' : added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
