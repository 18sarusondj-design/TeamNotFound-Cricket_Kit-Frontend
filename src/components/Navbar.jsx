import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { cartCount } = useCart();

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
      <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <Activity size={28} color="#38bdf8" />
        <span className="nav-title">TeamNotFound</span>
      </div>

      <div className="nav-links-center">
        {token && <Link to="/home" className="nav-item">Home</Link>}
        <Link to="/products" className="nav-item">Products</Link>
      </div>

      <div className="nav-actions">
        <Link to="/cart" className="cart-icon-wrapper" title="Cart" style={{ position: 'relative' }}>
          <ShoppingCart size={24} color="#f8fafc" />
          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>
        
        {token ? (
          <div className="auth-buttons">
            <Link to="/profile" className="icon-btn" title="Profile"><User size={20} /></Link>
            <button onClick={handleLogout} className="icon-btn" title="Logout" style={{ border: 'none', cursor: 'pointer' }}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-secondary nav-btn-small">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
