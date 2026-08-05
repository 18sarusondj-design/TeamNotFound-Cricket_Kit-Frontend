import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, id, email, fullName, role } = response.data;
      
      if (role !== 'ROLE_SUPERADMIN') {
        toast.error('Access Denied. Super Admin privileges required.');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email, fullName, role }));
      
      toast.success('Super Admin Login successful!');
      navigate('/superadmin');
    } catch (err) {
      if (err.response?.data?.error) {
         toast.error(err.response.data.error);
      } else {
         toast.error('Invalid credentials or server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconWrapperStyle}>
          <ShieldAlert size={40} color="#0066FF" />
        </div>
        <h2 style={titleStyle}>Super Admin Portal</h2>
        <p style={subtitleStyle}>Restricted Access</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input 
              type="text" 
              name="identifier" 
              style={inputStyle}
              value={formData.identifier}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                style={inputStyle}
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <div 
                style={eyeIconStyle} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" };
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', borderTop: '6px solid #0066FF' };
const iconWrapperStyle = { display: 'flex', justifyContent: 'center', marginBottom: '20px' };
const titleStyle = { margin: '0 0 8px', fontSize: '24px', fontWeight: 'bold', color: '#111827', textAlign: 'center' };
const subtitleStyle = { margin: '0 0 24px', color: '#0066FF', textAlign: 'center', fontSize: '14px', fontWeight: '600' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#4b5563' };
const inputStyle = { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' };
const eyeIconStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' };
const buttonStyle = { marginTop: '10px', padding: '12px', backgroundColor: '#0066FF', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 15px rgba(0, 102, 255, 0.3)' };

export default SuperAdminLogin;
