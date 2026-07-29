import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Trophy, Star } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Background Animated Elements */}
      <div className="landing-bg-gradient"></div>

      {/* Navbar */}
      <Navbar />

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
