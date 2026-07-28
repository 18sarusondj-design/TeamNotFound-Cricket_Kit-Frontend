import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { identifier });
      navigate('/verify-otp', { state: { identifier, message: 'OTP sent successfully!' } });
    } catch (err) {
      if (err.response?.data?.error) {
         setError(err.response.data.error);
      } else {
         setError('Failed to process request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box glass-card">
        <h2>Reset Password</h2>
        <p>Enter your email or mobile number to receive an OTP.</p>
        
        {message && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Mobile Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
