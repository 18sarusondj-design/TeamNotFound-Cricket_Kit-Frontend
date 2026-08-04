import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronDown, ChevronUp, X } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderCard = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);
  
  const totalItems = order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div 
          onClick={() => setShowModal(true)}
          style={{ 
            background: '#f8fafc', 
            padding: '1.2rem 1.5rem', 
            cursor: 'pointer',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
        >
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#0f172a' }}>Order ID: {order.orderId}</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              {order.createdAt ? `Date: ${new Date(order.createdAt).toLocaleDateString()}` : 'Date: Recently placed'} • Total: ₹{order.totalAmount} • Items: {totalItems}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ 
              padding: '0.4rem 1rem', 
              borderRadius: '999px', 
              fontSize: '0.85rem', 
              fontWeight: 'bold',
              background: order.status === 'SUCCESS' ? '#dcfce7' : order.status === 'PENDING' ? '#fef08a' : '#fee2e2',
              color: order.status === 'SUCCESS' ? '#166534' : order.status === 'PENDING' ? '#854d0e' : '#991b1b'
            }}>
              {order.status}
            </span>
            {order.status === 'SUCCESS' && (
              <span style={{ 
                padding: '0.4rem 1rem', 
                borderRadius: '999px', 
                fontSize: '0.85rem', 
                fontWeight: 'bold',
                background: order.deliveryStatus === 'COMPLETED' ? '#dcfce7' : '#e0f2fe',
                color: order.deliveryStatus === 'COMPLETED' ? '#166534' : '#0369a1'
              }}>
                {(order.deliveryStatus || 'PENDING').replace(/_/g, ' ')}
              </span>
            )}
            <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              View Details
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Popup */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
               <div>
                 <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>Order Items</h3>
                 <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Order ID: {order.orderId}</p>
               </div>
               <button 
                 onClick={() => setShowModal(false)}
                 style={{
                   background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                   padding: '0.5rem', borderRadius: '50%', display: 'flex'
                 }}
                 onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
               >
                 <X size={24} />
               </button>
            </div>
            
            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {order.items && order.items.map((item, index) => (
                 <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: index !== order.items.length - 1 ? '1.5rem' : 0, paddingBottom: index !== order.items.length - 1 ? '1.5rem' : 0, borderBottom: index !== order.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                   <div style={{ width: '90px', height: '90px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                     {item.product?.images && item.product.images.length > 0 ? (
                       <img src={item.product.images[0].imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     ) : (
                       <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>No Image</div>
                     )}
                   </div>
                   
                   <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.product?.name}</h4>
                          {item.product?.category && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 'bold' }}>{item.product.category.categoryName}</span>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{item.totalPrice}</p>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Qty: {item.quantity} × ₹{item.pricePerUnit}</p>
                        </div>
                     </div>
                     <p style={{ margin: '0.7rem 0 0 0', color: '#475569', fontSize: '0.9rem', lineHeight: '1.4' }}>
                       {item.product?.description?.length > 120 ? item.product.description.substring(0, 120) + '...' : item.product?.description}
                     </p>
                   </div>
                 </div>
              ))}
              {(!order.items || order.items.length === 0) && (
                 <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>No items details available.</p>
              )}
            </div>
            
            {/* Modal Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
               <span style={{ color: '#64748b', fontWeight: 'bold' }}>Total Amount</span>
               <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#faf9f6' }}><h2>Loading Orders...</h2></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack={true} />
      
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 2rem', flex: 1 }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          
          <div className="glass-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '50%' }}>
                  <ShoppingBag size={32} color="white" />
                </div>
                <h2 style={{ margin: 0, textAlign: 'left', color: '#0f172a' }}>Order History</h2>
             </div>
             
             {orders.length === 0 ? (
               <p style={{ textAlign: 'center', color: '#64748b', padding: '4rem 0' }}>No orders found.</p>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
                  {orders.map(order => (
                     <OrderCard key={order.orderId} order={order} />
                  ))}
               </div>
             )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
