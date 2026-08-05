import React from 'react';
import { MapPin, Phone, Mail, Activity } from 'lucide-react';
import '../index.css';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 2rem 1.5rem', marginTop: 'auto' }}>
      <div className="header-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Brand Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Activity size={32} color="#0066FF" />
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              TeamNotFound
            </div>
          </div>
          <p style={{ color: '#94a3b8', lineHeight: '1.6', textAlign: 'left' }}>
            Your ultimate destination for premium sports gear. We provide top-quality equipment for athletes of all levels, helping you perform your best.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>Contact Us</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color="#0066FF" />
              123 Sports Avenue, Cricket City, 456789
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="#0066FF" />
              +91 98765 43210
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="#0066FF" />
              support@teamnotfound.com
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>Follow Us</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
              Instagram
            </a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
              Facebook
            </a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
              Twitter
            </a>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} TeamNotFound Sports. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
