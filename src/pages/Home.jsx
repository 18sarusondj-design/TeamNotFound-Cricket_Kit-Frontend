import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Activity, ShoppingCart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={32} color="#6366f1" />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>TeamNotFound</span>
        </div>
        
        <div className="nav-links">
          <Link to="/products" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px', border: 'none' }}>
             Store
          </Link>
          <Link to="/cart" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px', border: 'none' }}>
             <ShoppingCart size={18} />
             Cart
          </Link>
          <Link to="/profile" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px' }}>
            <User size={18} />
            {user?.fullName?.split(' ')[0] || 'Profile'}
          </Link>
          <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px', margin: 0 }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section with Animations */}
      <div className="home-hero">
        <div className="home-bg-image"></div>
        
        {/* The Animated Cricket Ball */}
        <div className="cricket-ball"></div>

        <div className="home-content">
          <h1 className="home-title">Welcome to TeamNotFound</h1>
          <p className="home-subtitle">Your ultimate destination for premium cricket gear and equipment.</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', animation: 'fadeIn 2s ease-out' }}>
             <Link to="/products" className="btn btn-primary" style={{ maxWidth: '200px', textDecoration: 'none' }}>Shop Now</Link>
             <button className="btn btn-secondary" style={{ maxWidth: '200px' }}>View Offers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
