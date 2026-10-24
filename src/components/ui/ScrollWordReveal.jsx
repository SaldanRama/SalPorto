import React, { useRef, useState, useEffect, useMemo } from 'react';
import './ScrollWordReveal.css';

/**
 * ScrollWordReveal Component
 * Splits headline text into individual words and reveals/illuminates each word
 * progressively based on scroll position through the viewport.
 */
export function ScrollWordReveal({
  text = '',
  as: Component = 'h2',
  className = '',
  italicWords = [],
  revealThreshold = 0.88,
  completeThreshold = 0.38,
  style = {},
}) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when the top enters revealThreshold of viewport
      const start = windowHeight * revealThreshold;
      // Finish revealing when reaching completeThreshold of viewport
      const end = windowHeight * completeThreshold;

      // Calculate progress clamp [0, 1]
      const currentProgress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(currentProgress);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [revealThreshold, completeThreshold]);

  const words = useMemo(() => {
    return text.split(/\s+/).filter(Boolean);
  }, [text]);

  return (
    <Component
      ref={containerRef}
      className={`scroll-word-reveal-headline ${className}`}
      style={style}
    >
      {words.map((rawWord, idx) => {
        // Strip markdown asterisks / underscores for clean check
        const cleanWord = rawWord.replace(/^[*_]+|[*_.,!?;:]+$/g, '');
        const isItalic =
          rawWord.startsWith('*') ||
          rawWord.startsWith('_') ||
          italicWords.some((w) => cleanWord.toLowerCase() === w.toLowerCase());

        const displayWord = rawWord.replace(/^[*_]+|[*_]+$/g, '');

        // Stagger threshold per word
        const total = words.length;
        const step = 1 / total;
        const wordStart = idx * step;
        const wordEnd = (idx + 1) * step;

        // Individual word transition progress
        const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));

        // Opacity smoothly moves from 0.18 to 1
        const opacity = 0.18 + wordProgress * 0.82;
        // Subtle translateY lift (6px -> 0px)
        const translateY = (1 - wordProgress) * 6;

        return (
          <span
            key={idx}
            className={`scroll-word-item ${isItalic ? 'scroll-word-item--italic' : ''} ${
              wordProgress >= 0.98 ? 'scroll-word-item--active' : ''
            }`}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {isItalic ? <em>{displayWord}</em> : displayWord}
            {idx < words.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </Component>
  );
}
