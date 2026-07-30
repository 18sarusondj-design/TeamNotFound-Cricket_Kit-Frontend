import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 3));
      } catch (err) {
        console.error("Could not fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [navigate]);

  return (
    <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

      {/* Top 3 Featured Products */}
      <div className="featured-section">
        <h2 className="featured-header">Top Featured Gear</h2>
        <div className="featured-grid">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="product-card skeleton-card" style={{ width: '100%' }}>
                <div className="skeleton skeleton-image" style={{ height: '200px' }}></div>
                <div className="product-content">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text short"></div>
                  <div className="product-footer" style={{ marginTop: '20px' }}>
                    <div className="skeleton skeleton-price"></div>
                    <div className="skeleton skeleton-button"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product.productId} product={product} />
            ))
          )}
        </div>
        
        <div className="shop-more-container">
          <Link to="/products" className="btn btn-primary shop-more-btn">
            Shop More Gear ➔
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
