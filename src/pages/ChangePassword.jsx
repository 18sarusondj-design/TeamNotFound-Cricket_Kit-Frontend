import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../api';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match');
    }

    setLoading(true);

    try {
      await api.put('/change-password', formData);
      // On success, backend invalidates all sessions, we must log out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { state: { message: 'Password changed successfully. Please log in with your new password.' } });
    } catch (err) {
      if (err.response?.data?.error) {
         setError(err.response.data.error);
      } else {
         setError('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Background Image */}
      <div className="home-bg-image" style={{ opacity: 0.15, animation: 'none' }}></div>
      
      <div className="auth-box glass-card" style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, padding: '2.5rem' }}>
        <Link to="/profile" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', padding: '0.4rem 0.8rem', width: 'auto' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }}/> Back to Profile
        </Link>
        
        <h2 style={{ textShadow: 'none', margin: '0 0 0.5rem 0' }}>Change Password</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>Update your account password securely.</p>
        
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#a5b4fc' }}>Current Password</label>
            <input 
              type="password" 
              name="currentPassword" 
              className="form-input" 
              style={{ background: 'rgba(15, 23, 42, 0.6)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="********"
              value={formData.currentPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label" style={{ color: '#a5b4fc' }}>New Password</label>
            <input 
              type="password" 
              name="newPassword" 
              className="form-input" 
              style={{ background: 'rgba(15, 23, 42, 0.6)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="********"
              value={formData.newPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <label className="form-label" style={{ color: '#a5b4fc' }}>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="form-input" 
              style={{ background: 'rgba(15, 23, 42, 0.6)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.8rem' }}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
