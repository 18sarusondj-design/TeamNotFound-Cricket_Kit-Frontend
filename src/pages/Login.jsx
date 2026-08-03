import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, id, email, fullName } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email, fullName }));
      
      toast.success('Login successful!');
      navigate('/products');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.status === 'UNVERIFIED') {
         toast.error(err.response.data.error);
         navigate('/verify-email', { state: { email: err.response.data.email } });
      } else if (err.response?.data?.error) {
         toast.error(err.response.data.error);
      } else {
         toast.error('Invalid credentials or server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box glass-card">
        <h2>Welcome Back</h2>
        <p>Log in to access your account and continue shopping.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Mobile Number</label>
            <input 
              type="text" 
              name="identifier" 
              className="form-input" 
              value={formData.identifier}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem' }}>Forgot password?</Link>
            </div>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-input" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
