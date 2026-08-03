import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
                     <div key={order.orderId} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                           <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#0f172a' }}>Order ID: {order.orderId}</p>
                              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                {order.createdAt ? `Date: ${new Date(order.createdAt).toLocaleDateString()}` : 'Date: Recently placed'} • Total: ₹{order.totalAmount}
                              </p>
                           </div>
                           <div>
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
                           </div>
                        </div>
                        
                        <div style={{ padding: '1.5rem' }}>
                          {order.items && order.items.map((item, index) => (
                             <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: index !== order.items.length - 1 ? '1.5rem' : 0, paddingBottom: index !== order.items.length - 1 ? '1.5rem' : 0, borderBottom: index !== order.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                               {/* Product Image */}
                               <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                 {item.product?.images && item.product.images.length > 0 ? (
                                   <img src={item.product.images[0].imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                 ) : (
                                   <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
                                 )}
                               </div>
                               
                               {/* Product Details */}
                               <div style={{ flex: 1 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{item.product?.name}</h4>
                                      {item.product?.category && <p style={{ margin: '0 0 0.5rem 0', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.product.category.categoryName}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{item.totalPrice}</p>
                                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Qty: {item.quantity} × ₹{item.pricePerUnit}</p>
                                    </div>
                                 </div>
                                 <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                   {item.product?.description?.length > 150 ? item.product.description.substring(0, 150) + '...' : item.product?.description}
                                 </p>
                               </div>
                             </div>
                          ))}
                          {(!order.items || order.items.length === 0) && (
                             <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>No items details available.</p>
                          )}
                        </div>
                     </div>
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
