import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = 'salporto_theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Ignore in SSR or restricted storage environments
    }
  }, [theme]);

  // Listen to OS theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Smooth circular wavefront transition originating from button coordinates
  const executeThemeTransition = (nextTheme, event) => {
    if (nextTheme === theme) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine origin coordinates for circular wave
    let x = typeof window !== 'undefined' ? window.innerWidth - 60 : 0;
    let y = 36;

    if (event) {
      if (typeof event.clientX === 'number' && typeof event.clientY === 'number' && event.clientX > 0) {
        x = event.clientX;
        y = event.clientY;
      } else if (event.currentTarget && event.currentTarget.getBoundingClientRect) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    } else {
      const btn = document.querySelector('.theme-toggle-btn');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const updateDOM = () => {
      setThemeState(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.style.colorScheme = nextTheme;
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (_) {}
    };

    // 1. Native View Transitions API (Chrome, Edge, Safari 18+, Brave, Arc)
    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion) {
      const transition = document.startViewTransition(() => {
        updateDOM();
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 620,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // 2. Fallback Ripple for browsers without View Transitions
    triggerFallbackRipple(x, y, nextTheme);
    updateDOM();
  };

  const toggleTheme = (event) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    executeThemeTransition(nextTheme, event);
  };

  const setTheme = (newTheme, event) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      executeThemeTransition(newTheme, event);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function triggerFallbackRipple(x, y, nextTheme) {
  try {
    const ripple = document.createElement('div');
    ripple.className = `theme-fallback-ripple ${
      nextTheme === 'dark' ? 'theme-fallback-ripple--dark' : 'theme-fallback-ripple--light'
    }`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    document.documentElement.classList.add('theme-transitioning');

    setTimeout(() => {
      ripple.remove();
      document.documentElement.classList.remove('theme-transitioning');
    }, 700);
  } catch (_) {}
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
