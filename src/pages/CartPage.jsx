import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus } from 'lucide-react';
import '../assets/cart.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We already have context, but let's simulate a tiny loader for smoothness
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    alert("🎉 Your order has been placed successfully! Thank you for shopping with TeamNotFound!");
    clearCart();
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="cart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <h2 style={{ color: '#3b82f6' }}>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
          style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#f8fafc', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Your Shopping Cart</h1>
        <p>Review your selected gear before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <ShoppingBag size={64} color="#94a3b8" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Your cart is empty</h2>
          <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Looks like you haven't added any premium gear yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '15px 40px', display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', borderRadius: '30px', fontSize: '1.1rem' }}>
             Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }}>Items ({cartItems.length})</h2>
              <button 
                onClick={clearCart}
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item premium-cart-item">
                  <img 
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'} 
                    alt={item.product.name} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details" style={{ flex: 2 }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>{item.product.name}</h3>
                    <p style={{ color: '#38bdf8' }}>{item.product.category ? item.product.category.categoryName : 'Uncategorized'}</p>
                    <p style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{item.product.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="cart-quantity-controls" style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '30px', padding: '5px' }}>
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.product.productId, item.quantity - 1) : removeFromCart(item.product.productId)}
                      className="qty-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="qty-btn"
                      style={{ opacity: item.quantity >= item.product.stock ? 0.5 : 1 }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="cart-item-total" style={{ flex: 1, textAlign: 'right', fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product.productId)}
                    className="remove-item-btn"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="cart-summary premium-summary">
              <h2 style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: '#10b981' }}>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
              
              <div className="summary-total" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#10b981' }}>₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <button onClick={handlePlaceOrder} className="checkout-btn" style={{ width: '100%', marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                Place Order <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
