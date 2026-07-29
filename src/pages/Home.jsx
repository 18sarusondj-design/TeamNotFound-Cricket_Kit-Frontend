import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar />

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
