import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Settings, ShieldAlert, Key } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import { toast } from 'sonner';
import api from '../api';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e2e8f0' }}>
          <ShieldAlert size={28} color="#0066FF" />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Super Admin</h1>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          <div 
            style={navItemStyle(activeTab === 'users')} 
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            User Management
          </div>
          <div 
            style={navItemStyle(activeTab === 'profile')} 
            onClick={() => setActiveTab('profile')}
          >
            <Settings size={20} />
            Profile Settings
          </div>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ backgroundColor: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <span style={{ fontWeight: '500', color: '#1f2937' }}>{user?.fullName}</span>
          </div>
        </header>

        <main style={{ padding: '40px' }}>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'profile' && <SuperAdminProfile />}
        </main>
      </div>
    </div>
  );
};

const SuperAdminProfile = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return;

    setLoading(true);
    try {
      await api.put('/superadmin/profile/password', { newPassword });
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#111827' }}>
        <Key size={24} color="#0066FF" /> Change Password
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Update your super admin password here.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>New Password</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#0066FF', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 24px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#eff6ff' : 'transparent',
  color: isActive ? '#0066FF' : '#475569',
  borderLeft: isActive ? '4px solid #0066FF' : '4px solid transparent',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.2s'
});

const logoutBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #fca5a5',
  borderRadius: '6px',
  cursor: 'pointer',
  justifyContent: 'center',
  transition: 'background 0.2s'
};

export default SuperAdminDashboard;
