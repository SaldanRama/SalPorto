import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './Layout.css';

export function Layout() {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Lock document scroll while loading screen is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  // Initialize smooth scroll reveal across entire application
  useScrollReveal();

  return (
    <div className="site-layout">
      {/* Interactive Multilingual & 3D Silver Folder Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

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
