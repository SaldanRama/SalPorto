import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = (e) => {
    setIsAnimating(true);
    toggleTheme(e);
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isAnimating ? 'theme-toggle-btn--animating' : ''}`}
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Expanding shockwave pulse ring on click */}
      <span className="theme-toggle-ring" aria-hidden="true" />

      {/* 3D spring morphing icons */}
      <span className={`theme-icon-wrapper ${isDark ? 'theme-icon--dark' : 'theme-icon--light'}`}>
        <span className="theme-icon-sun" aria-hidden="true">
          <Sun size={17} strokeWidth={2.2} />
        </span>
        <span className="theme-icon-moon" aria-hidden="true">
          <Moon size={17} strokeWidth={2.2} />
        </span>
      </span>
    </button>
  );
}
