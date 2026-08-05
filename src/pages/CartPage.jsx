import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
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

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { returnUrl: '/cart' } });
      return;
    }

    try {
      // 1. Create Order on Backend
      const { data: orderData } = await api.post('/orders/create', { amount: totalAmount });

      // 2. Initialize Razorpay Checkout
      const options = {
        key: 'rzp_test_TJzLyJpVH55How', // Using real test key provided
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: 'TeamNotFound',
        description: 'Premium Sports Gear',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature on Backend
            await api.post('/orders/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("🎉 Payment Successful! Your order has been placed! Thank you for shopping with TeamNotFound!");
            clearCart();
            navigate('/products');
          } catch (err) {
            console.error("Payment verification failed", err);
            toast.error("Payment verification failed! Please contact support.");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#1e3a8a"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error("Payment Failed! Reason: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Failed to initiate payment. " + (err.response?.data?.error || err.message));
    }
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
          className="action-btn-outline"
          style={{ position: 'absolute', top: '0', left: '0' }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        
        <h1>Your Shopping Cart</h1>
        <p>Review your selected gear before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <ShoppingBag size={64} color="#0066FF" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Your cart is empty</h2>
          <p style={{ marginBottom: '2rem', color: '#4b5563' }}>Looks like you haven't added any premium gear yet.</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '15px 40px', display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', borderRadius: '30px', fontSize: '1.1rem' }}>
             Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Items ({cartItems.length})</h2>
              <button 
                onClick={clearCart}
                className="action-btn-outline"
                style={{ padding: '8px 15px', color: '#0066FF', borderColor: '#0066FF' }}
              >
                <Trash2 size={16} style={{ marginRight: '5px' }} /> Clear Cart
              </button>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="premium-cart-item">
                  <img 
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'} 
                    alt={item.product.name} 
                    className="cart-item-image" 
                  />
                  
                  <div className="cart-item-details" style={{ flex: 1 }}>
                    <h3>{item.product.name}</h3>
                    <p style={{ marginBottom: '10px' }}>{item.product.category ? item.product.category.categoryName : 'Uncategorized'}</p>
                    
                    <div className="cart-item-controls-row" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span className="cart-item-price" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{item.product.price.toLocaleString()}</span>
                      
                      <div className="cart-quantity-controls">
                        <button 
                          onClick={() => item.quantity > 1 ? updateQuantity(item.product.productId, item.quantity - 1) : removeFromCart(item.product.productId)}
                          className="qty-btn-orange"
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="qty-btn-orange"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cart-item-right-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => removeFromCart(item.product.productId)}
                      className="remove-item-btn"
                      title="Remove item"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <Trash2 size={20} />
                    </button>
                    <span className="cart-item-total" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0066FF' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="premium-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <button onClick={handlePlaceOrder} className="checkout-btn-orange">
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
