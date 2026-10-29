import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './LoadingScreen.css';

/**
 * Multilingual greetings cycling in sequence
 * Minimalist geometric typography (matching Bonjour reference)
 */
const GREETINGS = [
  { text: 'Halo', lang: 'id', label: 'Indonesian' },
  { text: 'Hello', lang: 'en', label: 'English' },
  { text: 'Bonjour', lang: 'fr', label: 'French' },
  { text: 'こんにちは', lang: 'ja', label: 'Japanese' },
  { text: '你好', lang: 'zh', label: 'Chinese' },
  { text: 'مرحباً', lang: 'ar', label: 'Arabic' },
];

/**
 * 3 Featured Cards emerging from within the folder cavity
 * Native 4:5 aspect ratio preserved
 */
const FOLDER_ASSETS = [
  {
    id: 'card-top',
    name: 'Top Feature',
    src: encodeURI('/images/Loading Assets/PUTRA.jpg'),
  },
  {
    id: 'card-left',
    name: 'Left Showcase',
    src: encodeURI('/images/Loading Assets/row-1-column-1.png'),
  },
  {
    id: 'card-right',
    name: 'Right Showcase',
    src: encodeURI('/images/Loading Assets/row-1-column-3.png'),
  },
];

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [prevGreetingIndex, setPrevGreetingIndex] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  // 1. Cycle Greetings with smooth upward sliding transition every 550ms
  useEffect(() => {
    const greetingTimer = setInterval(() => {
      setGreetingIndex((curr) => {
        setPrevGreetingIndex(curr);
        return (curr + 1) % GREETINGS.length;
      });
    }, 550);
    return () => clearInterval(greetingTimer);
  }, []);

  // 2. Smoothly Increment Loading Progress from 0 to 100% over 2.9 seconds
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2900;
    let animationFrameId;

    const animateProgress = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const linearProgress = Math.min(1, elapsed / duration);

      // Smooth custom acceleration curve
      const easedProgress = Math.min(100, Math.floor(linearProgress * 100));
      setProgress(easedProgress);

      if (linearProgress < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Hold at 100% briefly so all 3 cards and final greeting are appreciated
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 850);
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Instant skip button handler
  const handleQuickSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  // Easing helper for silky physics movement
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  // 1. Realistic folder opening animation (Flap tilts forward around bottom axis)
  // Opens smoothly between 4% and 28% of progress
  const flapProgress = Math.max(0, Math.min(1, (progress - 4) / 24));
  const flapEased = easeOutCubic(flapProgress);
  const flapAngle = -18 * flapEased; // 3D forward tilt in degrees

  // 2. Card emergence & expansion progress calculations
  // Inside the 50% compact folder: cards sit scaled at 1.0 to fit realistically
  // As they emerge: they expand dynamically to scale ~1.72 (full showcase size)
  // - Top card emerges between 16% and 52%
  const topProgress = Math.max(0, Math.min(1, (progress - 16) / 36));
  // - Left card emerges between 36% and 72%
  const leftProgress = Math.max(0, Math.min(1, (progress - 36) / 36));
  // - Right card emerges between 56% and 90%
  const rightProgress = Math.max(0, Math.min(1, (progress - 56) / 34));

  const topEased = easeOutCubic(topProgress);
  const leftEased = easeOutCubic(leftProgress);
  const rightEased = easeOutCubic(rightProgress);

  // Dynamic scale expansion from compact inside folder to refined showcase size
  const topScale = 1.0 + topEased * 0.35;
  const leftScale = 1.0 + leftEased * 0.32;
  const rightScale = 1.0 + rightEased * 0.32;

  return (
    <aside
      className={`app-loading-screen ${isExiting ? 'is-exiting' : ''}`}
      aria-live="polite"
      aria-label="Loading portfolio experience"
    >
      {/* Background Architectural Dot Grid */}
      <div className="loading-bg-grid" aria-hidden="true" />
      <div className="loading-ambient-glow" aria-hidden="true" />

      {/* Top Header Bar */}
      <div className="loading-top-bar">
        <span className="loading-status-indicator">
          <span className="status-dot-pulse" aria-hidden="true" />
          <span>INITIALIZING WORKSPACE</span>
        </span>
        <button
          type="button"
          className="loading-skip-btn"
          onClick={handleQuickSkip}
          aria-label="Skip loading animation"
        >
          <span>Skip</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Centerpiece Stage: Folder on top, Multilingual Sliding Ticker below */}
      <div className="loading-main-stage">
        {/* =========================================================================
            REALISTIC SILVER GLASSMORPHISM FOLDER
            Images live in the interior cavity (behind the front flap, in front of back plate).
            As loading proceeds, images glide out smoothly from within the folder.
           ========================================================================= */}
        <div className="folder-assembly-wrap">
          {/* Layer 1: Folder Back Plate with curved tab */}
          <div className="folder-back-plate" aria-hidden="true">
            <div className="folder-back-tab-shape" />
          </div>

          {/* Layer 2: Interior Cavity with 3 Emerging Cards */}
          <div className="folder-cards-cavity" aria-hidden="true">
            {/* Card 1: Center Top (PUTRA.jpg) */}
            <div
              className="folder-emergent-card card-pos-top"
              style={{
                transform: `translate3d(0, ${-topEased * 78}px, 0) scale(${topScale}) rotate(${
                  -2 * topEased
                }deg)`,
                opacity: topProgress > 0.05 ? 1 : 0,
              }}
            >
              <div className="emergent-card-frame">
                <img
                  src={FOLDER_ASSETS[0].src}
                  alt="Portfolio highlight top"
                  className="emergent-card-img"
                  loading="eager"
                  decoding="async"
                />
                <div className="emergent-card-glare" />
              </div>
            </div>

            {/* Card 2: Left (row-1-column-1.png) */}
            <div
              className="folder-emergent-card card-pos-left"
              style={{
                transform: `translate3d(${-leftEased * 82}px, ${
                  -leftEased * 28
                }px, 0) scale(${leftScale}) rotate(${-9 * leftEased}deg)`,
                opacity: leftProgress > 0.05 ? 1 : 0,
              }}
            >
              <div className="emergent-card-frame">
                <img
                  src={FOLDER_ASSETS[1].src}
                  alt="Portfolio highlight left"
                  className="emergent-card-img"
                  loading="eager"
                  decoding="async"
                />
                <div className="emergent-card-glare" />
              </div>
            </div>

            {/* Card 3: Right (row-1-column-3.png) */}
            <div
              className="folder-emergent-card card-pos-right"
              style={{
                transform: `translate3d(${rightEased * 82}px, ${
                  -rightEased * 28
                }px, 0) scale(${rightScale}) rotate(${9 * rightEased}deg)`,
                opacity: rightProgress > 0.05 ? 1 : 0,
              }}
            >
              <div className="emergent-card-frame">
                <img
                  src={FOLDER_ASSETS[2].src}
                  alt="Portfolio highlight right"
                  className="emergent-card-img"
                  loading="eager"
                  decoding="async"
                />
                <div className="emergent-card-glare" />
              </div>
            </div>
          </div>

          {/* Layer 3: Realistic Silver Glassmorphism Front Flap with 3D opening tilt */}
          <div
            className="folder-front-flap"
            style={{
              transform: `rotateX(${flapAngle}deg)`,
            }}
          >
            {/* Folder Top Tab Bar with Orange Capsule Badge & Diagonal Arrow */}
            <div className="folder-front-tab-row">
              <div className="folder-tab-badge">
                <span className="folder-badge-dot" />
                <span>Open Folder</span>
              </div>
              <div className="folder-tab-arrow-btn">
                <ArrowUpRight size={11} />
              </div>
            </div>

            {/* Folder Body Center Title */}
            <div className="folder-front-title-wrap">
              <h2 className="folder-front-title">Portfolio</h2>
            </div>

            {/* Realistic Frosted Glass Highlights & Reflections */}
            <div className="folder-glass-specular-rim" aria-hidden="true" />
            <div className="folder-glass-diagonal-shine" aria-hidden="true" />
          </div>
        </div>

        {/* =========================================================================
            MULTILINGUAL SLIDING GREETINGS (BELOW THE FOLDER)
            Positioned cleanly below the folder so it is NEVER obscured.
            Words slide smoothly upward, replacing the previous language.
           ========================================================================= */}
        <div className="loading-ticker-below">
          <div className="ticker-window" aria-hidden="true">
            {GREETINGS.map((item, idx) => {
              const isCurrent = idx === greetingIndex;
              const isPrev = idx === prevGreetingIndex;

              let stateClass = 'is-hidden';
              if (isCurrent) stateClass = 'is-current';
              else if (isPrev) stateClass = 'is-prev';

              return (
                <div
                  key={item.text}
                  className={`ticker-item ${stateClass} ${
                    item.lang === 'ar' ? 'is-arabic' : ''
                  }`}
                >
                  <span className="ticker-text">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Details (Matching Reference Image 1) */}
      <footer className="loading-footer-dock">
        {/* Bottom Left: Portfolio Signature */}
        <div className="loading-footer-brand">
          <span className="footer-brand-title">Saldan Rama / Portfolio</span>
        </div>

        {/* Bottom Right: Digital Progress Counter (0 to 100) */}
        <div className="loading-footer-counter" aria-hidden="true">
          <span className="counter-digits">{progress}</span>
        </div>
      </footer>
    </aside>
  );
}

export default LoadingScreen;
