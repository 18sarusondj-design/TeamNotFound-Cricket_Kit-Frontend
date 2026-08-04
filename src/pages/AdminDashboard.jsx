import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Users, ShoppingBag, BarChart3, User, LogOut, KeyRound, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import ProductManagement from '../components/admin/ProductManagement';
import UserManagement from '../components/admin/UserManagement';
import OrderManagement from '../components/admin/OrderManagement';
import RevenueAnalytics from '../components/admin/RevenueAnalytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'products');
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ fullName: '', email: '' });
  const [formData, setFormData] = useState({ fullName: '', password: '' });
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/admin/login');
      return;
    }
    setAdminInfo({ fullName: user.fullName, email: user.email, id: user.id });
    setFormData({ fullName: user.fullName, password: '' });
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminTab');
    navigate('/admin/login');
  };

  const switchTab = (key) => {
    setActiveTab(key);
    localStorage.setItem('adminTab', key);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { fullName: formData.fullName };
      if (formData.password) payload.password = formData.password;
      await api.put(`/admin/users/${adminInfo.id}`, payload);

      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      user.fullName = formData.fullName;
      localStorage.setItem('user', JSON.stringify(user));
      setAdminInfo(prev => ({ ...prev, fullName: formData.fullName }));

      toast.success('Profile updated successfully!');
      setEditModalOpen(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { key: 'products', label: 'Products',  icon: ShoppingBag },
    { key: 'orders',   label: 'Orders',    icon: LayoutDashboard },
    { key: 'revenue',  label: 'Analytics', icon: BarChart3 },
    { key: 'users',    label: 'Users',     icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductManagement />;
      case 'users': return <UserManagement />;
      case 'orders': return <OrderManagement />;
      case 'revenue': return <RevenueAnalytics />;
      default: return <ProductManagement />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Admin Header ── */}
      <header style={styles.header}>
        {/* Logo */}
        <div style={styles.logo}>
          <Activity size={24} color="#38bdf8" />
          <span style={styles.logoText}>TeamNotFound</span>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        {/* Profile dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            style={styles.profileBtn}
            title={adminInfo.fullName}
          >
            <div style={styles.avatarRing}>
              <User size={18} color="white" />
            </div>
            <span style={styles.adminName}>{adminInfo.fullName}</span>
          </button>

          {profileOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <p style={{ margin: 0, fontWeight: '700', color: '#0f172a' }}>{adminInfo.fullName}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{adminInfo.email}</p>
              </div>
              <div style={styles.dropdownDivider} />
              <button
                onClick={() => { setProfileOpen(false); setEditModalOpen(true); }}
                style={styles.dropdownItem}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <KeyRound size={15} color="#475569" /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{ ...styles.dropdownItem, color: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={15} color="#ef4444" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>NAVIGATION</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                style={{
                  ...styles.navBtn,
                  backgroundColor: activeTab === key ? '#e0f2fe' : 'transparent',
                  color: activeTab === key ? '#0284c7' : '#475569',
                  fontWeight: activeTab === key ? '600' : '500',
                  borderLeft: activeTab === key ? '3px solid #0284c7' : '3px solid transparent',
                }}
              >
                <Icon size={19} /> {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>

      {/* ── Edit Profile Modal ── */}
      {editModalOpen && (
        <div style={styles.overlay} onClick={() => setEditModalOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Edit Profile</h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  style={styles.formInput}
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={styles.formLabel}>New Password <span style={{ color: '#94a3b8', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                <input
                  type="password"
                  style={styles.formInput}
                  placeholder="Enter new password..."
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '12px', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', marginTop: '4px' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    height: '64px',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontWeight: '800', fontSize: '18px', color: 'white', letterSpacing: '-0.3px' },
  adminBadge: {
    backgroundColor: 'rgba(14,165,233,0.15)',
    color: '#38bdf8',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid rgba(14,165,233,0.3)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  profileBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '40px', padding: '5px 14px 5px 5px', cursor: 'pointer',
    transition: 'background 0.2s',
  },
  avatarRing: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  adminName: { color: 'white', fontSize: '14px', fontWeight: '500' },
  dropdown: {
    position: 'absolute', top: '50px', right: 0,
    backgroundColor: 'white', borderRadius: '12px', minWidth: '200px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0',
    overflow: 'hidden', zIndex: 200,
  },
  dropdownHeader: { padding: '14px 16px', backgroundColor: '#f8fafc' },
  dropdownDivider: { height: '1px', backgroundColor: '#e2e8f0' },
  dropdownItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', padding: '11px 16px', border: 'none',
    background: 'transparent', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', color: '#334155', textAlign: 'left',
    transition: 'background 0.15s',
  },
  sidebar: {
    width: '230px', backgroundColor: 'white',
    borderRight: '1px solid #e2e8f0', padding: '24px 12px',
  },
  sidebarLabel: {
    fontSize: '10px', fontWeight: '700', color: '#94a3b8',
    letterSpacing: '1px', padding: '0 12px', marginBottom: '8px',
  },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '11px 14px', border: 'none', width: '100%',
    borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
    fontSize: '14px', transition: 'all 0.15s',
  },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 500, backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: 'white', borderRadius: '16px',
    padding: '32px', width: '420px', maxWidth: '90%',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
  },
  formLabel: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  formInput: {
    width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  },
};

export default AdminDashboard;
