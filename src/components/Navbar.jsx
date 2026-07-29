import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShoppingCart, User } from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="global-nav">
      <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <Activity size={28} color="#38bdf8" />
        <span className="nav-title">TeamNotFound</span>
      </div>

      <div className="nav-links-center">
        <Link to="/products" className="nav-item">Products</Link>
      </div>

      <div className="nav-actions">
        <Link to="/cart" className="cart-icon-wrapper">
          <ShoppingCart size={24} color="#f8fafc" />
        </Link>
        
        {token ? (
          <div className="auth-buttons">
            <Link to="/profile" className="icon-btn"><User size={20} /></Link>
            <button onClick={handleLogout} className="btn btn-secondary nav-btn-small">Logout</button>
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
