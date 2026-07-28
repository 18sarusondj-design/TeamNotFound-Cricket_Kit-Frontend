import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';
import AuthLayout from '../components/AuthLayout';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, email, navigate]);

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setResending(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/auth/resend-registration-otp', { email });
      setSuccess('A new OTP has been sent to your email.');
      setTimeLeft(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (otp.length !== 6) {
      return setError('Please enter a valid 6-digit OTP');
    }

    setLoading(true);
    try {
      await api.post('/auth/verify-registration', { email, otp });
      navigate('/login', { state: { message: 'Email verified successfully! You can now log in.' } });
    } catch (err) {
      if (err.response?.data?.error) {
         setError(err.response.data.error);
      } else {
         setError('Verification failed. Please check your OTP and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box glass-card">
        <h2>Verify Email</h2>
        <p>We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below to verify your account.</p>
        
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">One-Time Password</label>
            <input 
              type="text" 
              className="form-input" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Didn't receive the email?</p>
          <button 
            type="button" 
            onClick={handleResend} 
            disabled={timeLeft > 0 || resending}
            style={{ 
              background: 'none', border: 'none', 
              color: timeLeft > 0 ? '#94a3b8' : '#4f46e5',
              fontWeight: '600', cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
              textDecoration: timeLeft > 0 ? 'none' : 'underline'
            }}
          >
            {resending ? 'Resending...' : timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
