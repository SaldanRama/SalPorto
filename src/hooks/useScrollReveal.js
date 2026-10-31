import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to initialize smooth, performant scroll-triggered animations.
 * Observes all elements with [data-reveal] attribute and triggers their reveal classes.
 * Supports dynamically loaded DOM elements (e.g., async data fetching from Sanity).
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal all immediately
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
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
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    );

    const observeNewElements = () => {
      const elements = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in the visible viewport, reveal immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial check
    observeNewElements();
    const timer1 = setTimeout(observeNewElements, 60);
    const timer2 = setTimeout(observeNewElements, 300);

    // Watch for dynamic DOM additions (e.g. async-loaded projects or content updates)
    let mutationObserver = null;
    if ('MutationObserver' in window) {
      mutationObserver = new MutationObserver(() => {
        observeNewElements();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);
}
