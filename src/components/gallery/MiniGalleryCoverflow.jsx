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
      {/* Pure Headline Only: "Mini Gallery" */}
      <div className="coverflow-minimal-head">
        <h3 className="coverflow-minimal-title">Mini Gallery</h3>
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
              opacity = isVisible ? Math.max(0.35, 0.9 - Math.abs(diff) * 0.3) : 0;
              filter = 'brightness(0.6)';
            } else {
              // Left side cards
              const offsetPercent = -50 + diff * 32;
              const zBack = -Math.abs(diff) * 110;
              const scaleVal = Math.max(0.72, 1 - Math.abs(diff) * 0.14);
              transform = `translateX(${offsetPercent}%) translateY(-50%) translateZ(${zBack}px) rotateY(36deg) scale(${scaleVal})`;
              opacity = isVisible ? Math.max(0.35, 0.9 - Math.abs(diff) * 0.3) : 0;
              filter = 'brightness(0.6)';
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
