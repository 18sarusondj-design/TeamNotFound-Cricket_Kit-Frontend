import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Fetching for user ID 1 (based on the sample data we inserted)
        const response = await axios.get('http://localhost:8080/api/cart/1');
        setCartItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items. Is the backend running?");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="cart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#10b981' }}>Loading your cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginTop: '50px' }}>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review your selected items before checkout</p>
      </div>

      <div className="cart-content">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img 
                  src={item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'} 
                  alt={item.product.name} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>Category: {item.product.category ? item.product.category.categoryName : 'N/A'}</p>
                </div>
              </div>
              <div className="cart-item-quantity">
                Qty: {item.quantity}
              </div>
              <div className="cart-item-price">
                ₹{(item.product.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <h2>Your cart is empty</h2>
            <p>Go to the products page to add some gear!</p>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h2>Total Summary</h2>
            <div className="cart-total">₹{totalAmount.toLocaleString()}</div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
