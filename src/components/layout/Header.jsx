import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import './Header.css';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Experience', to: '/experience' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Wordmark */}
        <Link to="/" className="header-wordmark" aria-label="Saldan Rama Home">
          <span>Saldan Rama</span>
          <span className="accent-dot" aria-hidden="true"></span>
          <span className="header-role-sub">Creative Technologist</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <ThemeToggle />

          <Button to="/contact" size="sm" variant="primary" className="header-cta-btn">
            <span>Get in Touch</span>
            <ArrowUpRight size={14} />
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden={!mobileMenuOpen}
        >
          <div
            id="mobile-navigation"
            className="mobile-nav-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="mobile-nav-footer">
              <Button to="/contact" variant="primary" size="md" style={{ width: '100%' }}>
                <span>Start a Project</span>
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
