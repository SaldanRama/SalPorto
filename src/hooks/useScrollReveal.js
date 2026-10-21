import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to initialize smooth, performant scroll-triggered animations.
 * Observes all elements with [data-reveal] attribute and triggers their reveal classes.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal all immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve after revealing so it only animates once smoothly
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px', // trigger slightly before bottom
        threshold: 0.1,
      }
    );

    // Give DOM a micro-tick to render
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
      elements.forEach((el) => observer.observe(el));
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);
}
