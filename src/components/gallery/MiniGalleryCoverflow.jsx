import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getMiniGallery } from '@/lib/sanityClient';
import './MiniGalleryCoverflow.css';

export function MiniGalleryCoverflow() {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const stageRef = useRef(null);

  // Load items from Sanity CMS or fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchGallery() {
      const data = await getMiniGallery();
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setItems(data.filter((d) => d.published !== false));
      }
    }
    fetchGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = items.length;

  // Next / Previous helpers
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay Effect (1 second interval as specified)
  useEffect(() => {
    if (!isPlaying || isHovered || isDragging || total <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isDragging, total, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isHovered) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, handleNext, handlePrev]);

  // Pointer / Touch Drag handlers for manual swiping
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    dragCurrentX.current = dragStartX.current;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    dragCurrentX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragCurrentX.current - dragStartX.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
  };

  if (total === 0) {
    return null;
  }

  return (
    <div
      className="coverflow-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDragging) setIsDragging(false);
      }}
      tabIndex={0}
      aria-label="Interactive 3D Coverflow Project Gallery"
    >
      {/* Header Row */}
      <div className="coverflow-header">
        <div className="coverflow-header-left">
          <div className="coverflow-badge">
            <Sparkles size={12} />
            <span>Mini Gallery • 16:9 Showcase</span>
          </div>
          <h3 className="coverflow-title">Visual Works &amp; Projects</h3>
          <p className="coverflow-subtitle">
            Koleksi visual resolusi tinggi dengan rasio 16:9. Bergeser otomatis setiap 1 detik atau geser manual melalui sentuhan dan tombol navigasi.
          </p>
        </div>

        {/* Controls: Play/Pause Autoplay toggle */}
        <div className="coverflow-controls-top">
          <button
            type="button"
            className={`coverflow-autoplay-toggle ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying((prev) => !prev)}
            title={isPlaying ? 'Jeda pergeseran otomatis' : 'Mulai pergeseran otomatis (1s)'}
          >
            <span className="coverflow-pulse-dot" />
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Auto 1s' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 3D Coverflow Stage */}
      <div
        className="coverflow-stage-container"
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Left Arrow */}
        {total > 1 && (
          <button
            type="button"
            className="coverflow-arrow-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* 3D Cards */}
        <div className="coverflow-stage">
          {items.map((item, index) => {
            // Calculate signed distance in circular carousel
            let diff = index - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isActive = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            // 3D Transform calculations based on Coverflow geometry
            let transform = '';
            let zIndex = 10 - Math.abs(diff);
            let opacity = 1;
            let filter = 'brightness(1)';

            if (isActive) {
              transform = 'translateX(-50%) translateY(-50%) translateZ(0px) rotateY(0deg) scale(1)';
              zIndex = 15;
              opacity = 1;
              filter = 'brightness(1)';
            } else if (diff > 0) {
              // Right side cards
              const offsetPercent = -50 + diff * 32;
              const zBack = -Math.abs(diff) * 110;
              const scaleVal = Math.max(0.72, 1 - Math.abs(diff) * 0.14);
              transform = `translateX(${offsetPercent}%) translateY(-50%) translateZ(${zBack}px) rotateY(-36deg) scale(${scaleVal})`;
              opacity = Math.abs(diff) > 2 ? 0 : Math.max(0.3, 0.9 - Math.abs(diff) * 0.3);
              filter = 'brightness(0.6)';
            } else {
              // Left side cards
              const offsetPercent = -50 + diff * 32;
              const zBack = -Math.abs(diff) * 110;
              const scaleVal = Math.max(0.72, 1 - Math.abs(diff) * 0.14);
              transform = `translateX(${offsetPercent}%) translateY(-50%) translateZ(${zBack}px) rotateY(36deg) scale(${scaleVal})`;
              opacity = Math.abs(diff) > 2 ? 0 : Math.max(0.3, 0.9 - Math.abs(diff) * 0.3);
              filter = 'brightness(0.6)';
            }

            return (
              <div
                key={item.id || item._id || index}
                className={`coverflow-card ${isActive ? 'active' : ''}`}
                style={{
                  transform,
                  zIndex,
                  opacity: isVisible ? opacity : 0,
                  filter,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  visibility: isVisible ? 'visible' : 'hidden',
                }}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div className="coverflow-media-box">
                  <img
                    src={item.url}
                    alt={item.title || 'Project Preview'}
                    className="coverflow-img"
                    loading="lazy"
                  />
                  <span className="coverflow-aspect-badge">16 : 9</span>

                  {/* Scrim Overlay with Title & Details */}
                  <div className="coverflow-scrim-overlay">
                    <div className="coverflow-info-content">
                      <div>
                        <h4 className="coverflow-item-title">{item.title}</h4>
                        {item.caption && (
                          <p className="coverflow-item-caption">{item.caption}</p>
                        )}
                      </div>

                      {item.linkUrl && item.linkUrl !== '#' && (
                        <a
                          href={item.linkUrl}
                          className="coverflow-view-action-btn"
                          onClick={(e) => e.stopPropagation()}
                          target={item.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          rel="noreferrer"
                        >
                          <span>Buka</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {total > 1 && (
          <button
            type="button"
            className="coverflow-arrow-btn next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Footer Indicators: Dots & Slide Counter */}
      {total > 1 && (
        <div className="coverflow-footer-nav">
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`coverflow-dot ${dotIdx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Pindah ke slide ${dotIdx + 1}`}
            />
          ))}
          <span className="coverflow-counter">
            {activeIndex + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}

export default MiniGalleryCoverflow;
