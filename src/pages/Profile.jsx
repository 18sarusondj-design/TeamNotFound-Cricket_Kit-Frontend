import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, LogOut, Key, User } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <Link to="/orders" className="btn btn-primary" style={{ width: 'auto' }}>
                  Order History
                </Link>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
