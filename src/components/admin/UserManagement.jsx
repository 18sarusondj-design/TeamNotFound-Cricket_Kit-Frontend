import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Edit, Save, X, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', role: '', password: '' });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ fullName: '', email: '', mobileNumber: '', password: '', role: 'ROLE_ADMIN' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/superadmin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ fullName: user.fullName, role: user.role || 'ROLE_USER', password: '' });
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/superadmin/users/${id}`, editForm);
      setEditingId(null);
      toast.success('User updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/superadmin/users', newForm);
      setShowAddForm(false);
      setNewForm({ fullName: '', email: '', mobileNumber: '', password: '', role: 'ROLE_ADMIN' });
      toast.success('User created successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>User Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0066FF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          <UserPlus size={18} /> {showAddForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1f2937' }}>Create New Account</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input style={inputStyle} placeholder="Full Name" value={newForm.fullName} onChange={e => setNewForm({...newForm, fullName: e.target.value})} required />
            <input style={inputStyle} placeholder="Email" type="email" value={newForm.email} onChange={e => setNewForm({...newForm, email: e.target.value})} required />
            <input style={inputStyle} placeholder="Mobile Number" value={newForm.mobileNumber} onChange={e => setNewForm({...newForm, mobileNumber: e.target.value})} required />
            <input style={inputStyle} placeholder="Password" type="password" value={newForm.password} onChange={e => setNewForm({...newForm, password: e.target.value})} required />

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0066FF', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Create</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading users...</p> : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}>{u.id}</td>
                  
                  {editingId === u.id ? (
                    <>
                      <td style={tdStyle}>
                        <input style={inputStyle} value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
                        <input style={{...inputStyle, marginTop: '5px'}} type="password" placeholder="New Pass (opt)" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                      </td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <select style={inputStyle} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                          <option value="ROLE_USER">User</option>
                          <option value="ROLE_ADMIN">Admin</option>
                          <option value="ROLE_SUPERADMIN">Super Admin</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleSave(u.id)} style={{ ...iconBtnStyle, color: '#10b981' }} title="Save"><Save size={18} /></button>
                        <button onClick={() => setEditingId(null)} style={{ ...iconBtnStyle, color: '#64748b' }} title="Cancel"><X size={18} /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{u.fullName}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          backgroundColor: u.role === 'ROLE_SUPERADMIN' ? '#fecaca' : (u.role === 'ROLE_ADMIN' ? '#dbeafe' : '#f1f5f9'),
                          color: u.role === 'ROLE_SUPERADMIN' ? '#991b1b' : (u.role === 'ROLE_ADMIN' ? '#1d4ed8' : '#475569')
                        }}>
                          {u.role === 'ROLE_SUPERADMIN' ? 'Super Admin' : (u.role === 'ROLE_ADMIN' ? 'Admin' : 'User')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => startEdit(u)} style={{ ...iconBtnStyle, color: '#0066FF', marginRight: '8px' }} title="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(u.id)} style={{ ...iconBtnStyle, color: '#ef4444' }} title="Delete"><Trash2 size={18} /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tableContainerStyle = { background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' };
const thStyle = { padding: '12px 15px', color: '#64748b', fontWeight: '600', fontSize: '14px' };
const tdStyle = { padding: '12px 15px', fontSize: '14px', color: '#1e293b' };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };
const inputStyle = { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

export default UserManagement;
