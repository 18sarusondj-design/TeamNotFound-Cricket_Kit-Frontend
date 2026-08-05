import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isNewCategory, setIsNewCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', imageUrl: ''
  });

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data.map(c => c.categoryName));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    } catch (error) {
      alert("Error deleting product.");
    }
  };

  const openModal = (product = null) => {
    setIsNewCategory(false);
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category?.categoryName || '',
        imageUrl: product.images?.[0]?.imageUrl || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: categories[0] || '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Error saving product.");
    }
  };

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category?.categoryName === selectedCategory
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Product Management</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            style={inputStyle} 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button onClick={() => openModal()} style={primaryBtnStyle}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {loading ? <p>Loading products...</p> : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}>{p.id}</td>
                  <td style={tdStyle}>
                    <img src={p.images?.[0]?.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category?.categoryName}</td>
                  <td style={tdStyle}>₹{p.price}</td>
                  <td style={tdStyle}>{p.stock}</td>
                  <td style={tdStyle}>
                    <button onClick={() => openModal(p)} style={{ ...iconBtnStyle, color: '#0066FF' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ ...iconBtnStyle, color: '#ef4444' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input style={inputStyle} required placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea style={{...inputStyle, height: '80px'}} required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input style={inputStyle} required type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input style={inputStyle} required type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              
              {!isNewCategory ? (
                <select 
                  style={inputStyle} 
                  required 
                  value={formData.category} 
                  onChange={e => {
                    if (e.target.value === 'NEW') setIsNewCategory(true);
                    else setFormData({...formData, category: e.target.value});
                  }}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="NEW" style={{ fontWeight: 'bold', color: '#0066FF' }}>+ Add New Category</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    style={{ ...inputStyle, flex: 1 }} 
                    required 
                    placeholder="Enter new category name" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                  />
                  <button type="button" onClick={() => {setIsNewCategory(false); setFormData({...formData, category: categories[0] || ''});}} style={{ padding: '0 10px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                </div>
              )}

              <input style={inputStyle} placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <button type="submit" style={primaryBtnStyle}>{editingId ? "Save Changes" : "Create Product"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const tableContainerStyle = { background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' };
const thStyle = { padding: '12px 15px', color: '#64748b', fontWeight: '600', fontSize: '14px' };
const tdStyle = { padding: '12px 15px', fontSize: '14px', color: '#1e293b' };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0066FF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' };
const inputStyle = { padding: '10px 15px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' };

export default ProductManagement;
