import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, LogOut, Key, Activity, User, ArrowLeft } from 'lucide-react';
import api from '../api';

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

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2 style={{color: 'white'}}>Loading...</h2></div>;
  }

  return (
    <div className="home-container">
      {/* Background Image (Reusing Home Page Styles) */}
      <div className="home-bg-image" style={{ opacity: 0.15, animation: 'none' }}></div>
      
      {/* Navigation Bar */}
      <nav className="home-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={32} color="#6366f1" />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>TeamNotFound</span>
        </div>
        
        <div className="nav-links">
          <Link to="/home" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px' }}>
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px', margin: 0 }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="home-hero" style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className="dashboard-container" style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          
          <div className="glass-card" style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="profile-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '15px', borderRadius: '50%' }}>
                  <User size={32} color="white" />
                </div>
                <h2 style={{ margin: 0, textAlign: 'left', textShadow: 'none' }}>Player Profile</h2>
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
                <div className="info-item" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="info-label" style={{ color: '#a5b4fc' }}>Batsman Name</span>
                  <span className="info-value" style={{ fontSize: '1.2rem' }}>{profile?.fullName}</span>
                </div>
                <div className="info-item" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="info-label" style={{ color: '#a5b4fc' }}>Email Address</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>{profile?.email}</span>
                </div>
                <div className="info-item" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="info-label" style={{ color: '#a5b4fc' }}>Mobile Number</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>{profile?.mobileNumber}</span>
                </div>
                <div className="info-item" style={{ borderBottom: 'none' }}>
                  <span className="info-label" style={{ color: '#a5b4fc' }}>Club Member Since</span>
                  <span className="info-value" style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>
                    {profile?.createdDate ? new Date(profile.createdDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
