import React from 'react';

const ProductCard = ({ product }) => {
  const { name, description, price, stock, category, images } = product;
  
  // Use first image if available, else placeholder
  const imageUrl = images && images.length > 0 
    ? images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
    
  const categoryName = category ? category.categoryName : 'Uncategorized';
  
  // Determine stock status class
  let stockClass = 'stock-indicator ';
  if (stock === 0) stockClass += 'out';
  else if (stock < 20) stockClass += 'low';
  else stockClass += 'in';

  return (
    <div className="product-card">
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
      </div>
    </div>
  );
};

export default ProductCard;
