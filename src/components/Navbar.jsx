import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, ShoppingCart, User, LogOut, Search, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api';
import '../index.css';

const Navbar = ({ showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { cartCount } = useCart();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === '/products') {
      setSearchTerm(params.get('search') || '');
    } else {
      setSearchTerm('');
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="global-nav">
      <div className="nav-content">
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {showBack && (
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={28} color="#38bdf8" />
            <span className="nav-title">TeamNotFound</span>
          </div>
        </div>

        <div className="nav-links-center" style={{ flex: 1, maxWidth: '600px', margin: '0 20px' }}>
          {token && location.pathname !== '/profile' && (
            <form onSubmit={handleSearchSubmit} className="search-bar-wrapper" style={{ margin: 0 }}>
              <input 
                type="text" 
                placeholder="Search products by spelling..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-premium"
                style={{ width: '100%' }}
              />
              <button type="submit" className="search-icon-btn">
                 <Search size={20} color="white" />
              </button>
            </form>
          )}
        </div>

        <div className="nav-actions">
          {token && (
            <Link to="/cart" className="cart-icon-wrapper" title="Cart" style={{ position: 'relative' }}>
              <ShoppingCart size={24} color="#f8fafc" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {token ? (
            <div className="auth-buttons">
              {location.pathname !== '/profile' && (
                <Link to="/profile" className="icon-btn" title="Profile"><User size={20} /></Link>
              )}
              {user && user.role === 'ROLE_ADMIN' && location.pathname !== '/admin' && (
                <button onClick={() => navigate('/admin')} className="btn btn-primary nav-btn-small" style={{ marginLeft: '10px' }}>
                  Admin Panel
                </button>
              )}
              <button onClick={handleLogout} className="icon-btn" title="Logout" style={{ border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary nav-btn-small">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
