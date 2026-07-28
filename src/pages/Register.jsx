import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '#e2e8f0', width: '0%' };
    if (pass.length < 6 || !/\d/.test(pass)) {
      return { label: 'Weak', color: '#ef4444', width: '33%' };
    }
    if (pass.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return { label: 'Strong', color: '#22c55e', width: '100%' };
    }
    return { label: 'Medium', color: '#eab308', width: '66%' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6 || !/\d/.test(formData.password)) {
      return setError('Password must be at least 6 characters and contain a number.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      if (err.response?.data?.error) {
         setError(err.response.data.error);
      } else if (err.response?.data) {
         const errors = Object.values(err.response.data).join(', ');
         setError(errors);
      } else {
         setError('Failed to connect to the server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box glass-card">
        <h2>Create Account</h2>
        <p>Join us to experience the best e-commerce platform.</p>
        
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              className="form-input" 
              value={formData.fullName}
              onChange={handleChange}
              required 
              minLength={3}
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input 
              type="text" 
              name="mobileNumber" 
              className="form-input" 
              value={formData.mobileNumber}
              onChange={handleChange}
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.2rem' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required 
              title="Min 6 chars, 1 number"
            />
          </div>
          
          {formData.password && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ color: '#64748b' }}>Password Strength:</span>
                <span style={{ color: strength.color, fontWeight: '600' }}>{strength.label}</span>
              </div>
              <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.25rem' }}>
                <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }}></div>
              </div>
              {strength.label === 'Weak' && (
                 <div style={{ color: '#ef4444', fontSize: '0.7rem' }}>
                   Must be at least 6 characters and contain 1 number.
                 </div>
              )}
            </div>
          )}
          {!formData.password && (
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
              Must be at least 6 characters and contain 1 number.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="form-input" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
