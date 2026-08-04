import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Edit, Save, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', role: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
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
      await api.put(`/admin/users/${id}`, editForm);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      alert('Error updating user');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>User Management</h2>

      {loading ? <p>Loading users...</p> : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Mobile</th>
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
                        <input style={{...inputStyle, marginTop: '5px'}} type="password" placeholder="New Password (optional)" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                      </td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.mobileNumber}</td>
                      <td style={tdStyle}>
                        <select style={inputStyle} value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                          <option value="ROLE_USER">User</option>
                          <option value="ROLE_ADMIN">Admin</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleSave(u.id)} style={{ ...iconBtnStyle, color: '#10b981' }}><Save size={18} /></button>
                        <button onClick={() => setEditingId(null)} style={{ ...iconBtnStyle, color: '#ef4444' }}><X size={18} /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{u.fullName}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>{u.mobileNumber}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          backgroundColor: u.role === 'ROLE_ADMIN' ? '#dbeafe' : '#f1f5f9',
                          color: u.role === 'ROLE_ADMIN' ? '#1d4ed8' : '#475569'
                        }}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => startEdit(u)} style={{ ...iconBtnStyle, color: '#0284c7' }}><Edit size={18} /></button>
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
