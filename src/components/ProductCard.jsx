import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { productId, name, description, price, stock, category, images } = product;
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  
  const imageUrl = images && images.length > 0 
    ? images[0].imageUrl 
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
    
  const categoryName = category ? category.categoryName : 'Uncategorized';
  
  let stockClass = 'stock-indicator ';
  if (stock === 0) stockClass += 'out';
  else if (stock < 20) stockClass += 'low';
  else stockClass += 'in';

  // Find if this product is already in the cart
  const cartItem = cartItems.find(item => item.product.productId === productId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login', { state: { returnUrl: '/products' } });
      return;
    }
    
    setAdding(true);
    await addToCart(productId, 1);
    setAdding(false);
  };

  const handleIncrement = async () => {
    if (quantityInCart >= stock) return; // Can't add more than stock
    await updateQuantity(productId, quantityInCart + 1);
  };

  const handleDecrement = async () => {
    if (quantityInCart <= 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, quantityInCart - 1);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="product-card premium-card">
        <div 
          className="product-image-container bg-simple-light" 
          onClick={() => setIsModalOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click to view details"
        >
          <img src={imageUrl} alt={name} className="product-image" />
          {/* We remove the category badge from the image as per the new design, it's shown in the text below instead */}
        </div>
        
        <div className="product-content premium-content">
          <h3 className="product-name">{name}</h3>
          <p className="product-category-text">{categoryName}</p>
          
          <div className="product-price-row">
            <span className="product-price">₹{price.toLocaleString()}</span>
            <span className="product-stock-text">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
            {quantityInCart > 0 ? (
              <div className="cart-quantity-selector">
                <button onClick={handleDecrement} className="cart-qty-btn">-</button>
                <span className="cart-qty-value">{quantityInCart}</span>
                <button onClick={handleIncrement} disabled={quantityInCart >= stock} className="cart-qty-btn">+</button>
              </div>
            ) : (
              <button 
                className="btn btn-add-cart"
                disabled={stock === 0 || adding}
                onClick={handleAddToCart}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="product-modal-overlay" 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="product-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              display: 'flex',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              animation: 'fadeIn 0.3s ease-out',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ×
            </button>
            <div style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
              <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }} />
            </div>
            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#4f46e5', fontWeight: '600', marginBottom: '10px' }}>{categoryName}</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: '#0f172a' }}>{name}</h2>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '1.1rem', flex: 1 }}>{description}</p>
              
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginBottom: '20px' }}>
                  ₹{price.toLocaleString()}
                </div>
                
                {quantityInCart > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <button 
                      onClick={handleDecrement}
                      style={{ flex: 1, padding: '15px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 30px', fontWeight: '600', fontSize: '1.2rem' }}>{quantityInCart}</span>
                    <button 
                      onClick={handleIncrement}
                      disabled={quantityInCart >= stock}
                      style={{ flex: 1, padding: '15px', background: '#f8fafc', border: 'none', cursor: quantityInCart >= stock ? 'not-allowed' : 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary"
                    disabled={stock === 0 || adding}
                    onClick={handleAddToCart}
                    style={{ width: '100%', padding: '15px', fontSize: '1.1rem', borderRadius: '12px' }}
                  >
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
