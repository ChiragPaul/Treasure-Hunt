import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PwaInstallButton from './PwaInstallPrompt';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    if (item === 'Registration') {
      navigate('/register');
      return;
    }
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(item.toLowerCase());
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(item.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      const element = document.getElementById('home');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '1.2rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      fontFamily: 'var(--font-mono)',
      color: 'var(--color-neon-green)',
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)',
      boxSizing: 'border-box'
    }}>
      <div className="nav-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px' }} onClick={handleHomeClick}>
        ZONE_4
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <ul className="nav-links" style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2rem',
          alignItems: 'center',
          margin: 0,
          padding: 0
        }}>
          {['History', 'Rulebooks', 'Registration'].map((item) => (
            <li key={item}>
              <button 
                onClick={() => handleNavClick(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-neon-green)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text)'}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <PwaInstallButton variant="nav" />
      </div>
    </nav>
  );
};

export default Navigation;
