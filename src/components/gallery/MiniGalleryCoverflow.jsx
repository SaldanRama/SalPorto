import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMiniGallery } from '@/lib/sanityClient';
import './MiniGalleryCoverflow.css';

export function MiniGalleryCoverflow() {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);

  // Load all images from Sanity Lake or fallback
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

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay 1 second interval, pauses when hovering or dragging
  useEffect(() => {
    if (total <= 1 || isHovered || isDragging) return;

    const timer = setInterval(() => {
      handleNext();
    }, 1000);

    return () => clearInterval(timer);
  }, [total, isHovered, isDragging, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isHovered) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, handleNext, handlePrev]);

  // Touch & Mouse Drag for manual swipe
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
    if (diff > 35) {
      handlePrev();
    } else if (diff < -35) {
      handleNext();
    }
  };

  if (total === 0) return null;

  return (
    <div
      className="coverflow-minimal-wrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDragging) setIsDragging(false);
      }}
      tabIndex={0}
      aria-label="Mini Gallery Coverflow"
    >
      {/* Pure Headline Only: "Mini Gallery" matching Experience headline */}
      <div className="coverflow-minimal-head">
        <h2 className="coverflow-minimal-title font-serif">Mini Gallery</h2>
      </div>

      {/* 3D Coverflow Stage - Centered, Pure 16:9 Images */}
      <div
        className="coverflow-stage-box"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div className="coverflow-stage-track">
          {items.map((item, index) => {
            // Calculate signed distance in circular carousel
            let diff = index - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);
            const isActive = diff === 0;
            // Allow up to 3 cards on each side to fill the horizontal screen space
            const isVisible = absDiff <= 3;

            // 3D Transform calculations: fan out side cards horizontally
            let transform = '';
            let zIndex = 20 - absDiff * 3;
            let opacity = 1;
            let filter = 'brightness(1)';

            if (isActive) {
              transform = 'translateX(-50%) translateY(-50%) translateZ(0px) rotateY(0deg) scale(1)';
              zIndex = 25;
              opacity = 1;
              filter = 'brightness(1)';
            } else {
              const sign = diff > 0 ? 1 : -1;

              // Generous horizontal spacing so background cards fill the sideways space
              let stepOffset = 0;
              if (absDiff === 1) {
                stepOffset = 70; // 1st card steps out generously from behind preview card
              } else if (absDiff === 2) {
                stepOffset = 135; // 2nd card fans out further towards the sides
              } else if (absDiff === 3) {
                stepOffset = 195; // 3rd card fills outer horizontal space
              } else {
                stepOffset = 195 + (absDiff - 3) * 55;
              }

              const offsetPercent = -50 + sign * stepOffset;
              const zBack = -absDiff * 95;
              const rotateDeg = sign * (-28 - Math.min(absDiff, 3) * 6);
              const scaleVal = Math.max(0.65, 1 - absDiff * 0.12);

              transform = `translateX(${offsetPercent}%) translateY(-50%) translateZ(${zBack}px) rotateY(${rotateDeg}deg) scale(${scaleVal})`;
              opacity = isVisible ? Math.max(0.25, 0.95 - absDiff * 0.24) : 0;
              filter = `brightness(${Math.max(0.35, 0.8 - absDiff * 0.18)})`;
            }

            return (
              <div
                key={item.id || item._id || index}
                className={`coverflow-card-pure ${isActive ? 'active' : ''}`}
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
                <div className="coverflow-card-media">
                  <img
                    src={item.url}
                    alt={item.title || `Gallery image ${index + 1}`}
                    className="coverflow-pure-img"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MiniGalleryCoverflow;
