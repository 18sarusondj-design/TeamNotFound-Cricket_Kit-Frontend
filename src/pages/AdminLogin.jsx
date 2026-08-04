import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      const { token, id, email, fullName, role } = response.data;

      if (role !== 'ROLE_ADMIN') {
        toast.error('Access Denied! You are not an administrator.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email, fullName, role }));
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background grid */}
      <div style={styles.gridBg} />

      {/* Glow orbs */}
      <div style={{ ...styles.orb, top: '-150px', left: '-150px', background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)' }} />
      <div style={{ ...styles.orb, bottom: '-150px', right: '-150px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <ShieldCheck size={36} color="white" />
          </div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>TeamNotFound — Restricted Access Only</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              type="text"
              placeholder="admin@teamnotfound.com"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              style={styles.input}
              required
              onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Lock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ ...styles.input, paddingRight: '48px' }}
                required
                onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={styles.spinner} /> Authenticating...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <ShieldCheck size={18} /> Sign In to Admin Panel
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          🔒 This portal is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0a0f1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  },
  orb: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
    boxShadow: '0 8px 24px rgba(14,165,233,0.4)',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '28px',
    fontWeight: '800',
    color: 'white',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
    letterSpacing: '0.3px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
    marginTop: '4px',
    fontFamily: 'inherit',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    color: '#475569',
    fontSize: '12px',
    lineHeight: '1.5',
  },
};

export default AdminLogin;
