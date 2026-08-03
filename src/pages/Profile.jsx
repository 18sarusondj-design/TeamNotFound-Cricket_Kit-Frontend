import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, LogOut, Key, User } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
        
        const ordersResponse = await api.get('/orders');
        setOrders(ordersResponse.data);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, []);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#faf9f6' }}><h2>Loading...</h2></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', display: 'flex', flexDirection: 'column' }}>
      <Navbar showBack={true} />
      
      {/* Profile Content */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 2rem', flex: 1 }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          
          <div className="glass-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <div className="profile-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '50%' }}>
                  <User size={32} color="white" />
                </div>
                <h2 style={{ margin: 0, textAlign: 'left', color: '#0f172a' }}>Player Profile</h2>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <Link to="/change-password" className="btn btn-secondary" style={{ width: 'auto' }}>
                  <Key size={18} style={{ marginRight: '8px' }}/> Change Password
                </Link>
              </div>
            </div>

            {error ? (
              <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            ) : (
              <div className="profile-info" style={{ marginTop: '1.5rem' }}>
                <div className="info-item" style={{ borderBottomColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="info-label" style={{ color: '#64748b' }}>Batsman Name</span>
                  <span className="info-value" style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 'bold' }}>{profile?.fullName}</span>
                </div>
                <div className="info-item" style={{ borderBottomColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="info-label" style={{ color: '#64748b' }}>Email Address</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#334155' }}>{profile?.email}</span>
                </div>
                <div className="info-item" style={{ borderBottomColor: 'rgba(0,0,0,0.05)' }}>
                  <span className="info-label" style={{ color: '#64748b' }}>Mobile Number</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#334155' }}>{profile?.mobileNumber}</span>
                </div>
                <div className="info-item" style={{ borderBottom: 'none' }}>
                  <span className="info-label" style={{ color: '#64748b' }}>Club Member Since</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#334155' }}>
                    {profile?.createdDate ? new Date(profile.createdDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
             <button onClick={() => setShowOrders(!showOrders)} className="btn btn-primary" style={{ width: 'auto' }}>
                {showOrders ? 'Hide Order History' : 'Show Order History'}
             </button>
          </div>

          {showOrders && (
            <div className="glass-card" style={{ background: 'white', marginTop: '1.5rem', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
               <h3 style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1rem', color: '#0f172a' }}>Order History</h3>
               {orders.length === 0 ? (
                 <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>No orders found.</p>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
                    {orders.map(order => (
                       <div key={order.orderId} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                             <div>
                                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#0f172a' }}>Order ID: {order.orderId}</p>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                  Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} • Total: ₹{order.totalAmount}
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
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Product ID: {item.product?.productId}</p>
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
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
