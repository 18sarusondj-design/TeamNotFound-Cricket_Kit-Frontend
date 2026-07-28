import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Trophy, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Background Animated Elements */}
      <div className="landing-bg-gradient"></div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={32} color="#6366f1" />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>TeamNotFound</span>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary nav-btn">Login</Link>
          <Link to="/register" className="btn btn-primary nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero">
        {/* Left Column: Text & Stats */}
        <div className="landing-hero-left">
          <h1 className="landing-title">
            Pure <br /> Performance.
          </h1>
          <p className="landing-subtitle">
            Professional-grade cricket gear that enhances your game.
          </p>
          
          <div className="landing-cta-buttons">
             <Link to="/register" className="btn btn-primary cta-btn">Shop Now</Link>
             <Link to="/login" className="btn btn-secondary cta-btn">Sign In</Link>
          </div>

        </div>

        {/* Right Column: Featured Image */}
        <div className="landing-hero-right">
          <div className="featured-image-wrapper">
             <div className="featured-image"></div>
             {/* The Animated Cricket Ball */}
             <div className="cricket-ball"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
