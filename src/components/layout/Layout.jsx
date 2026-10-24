import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './Layout.css';

export function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Initialize smooth scroll reveal across entire application
  useScrollReveal();

  return (
    <div className="site-layout">
      {/* Skip to Content for Keyboard Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Ambient background glows matching visual reference */}
      <div className="ambient-glow-top-right" aria-hidden="true" />
      <div className="ambient-glow-bottom-left" aria-hidden="true" />

      <Header />

      <main id="main-content" className="site-main" tabIndex="-1">
        <Outlet />
      </main>

      <Footer />

      {/* Static 15% Bottom Frosted Glass / Blur Overlay */}
      <div className="bottom-glass-dock" aria-hidden="true" />
    </div>
  );
}
