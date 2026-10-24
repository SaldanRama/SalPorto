import React, { useState, useEffect } from 'react';
import { Layers, Maximize2, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import './StackedImageGallery.css';

/**
 * StackedImageGallery Component
 * Renders 3 stacked photo cards with realistic tilt and depth.
 * Clicking the stack cycles through the photos sequentially.
 * Clicking the expand button or full preview opens an interactive Lightbox Modal
 * where photos can be inspected one by one in high definition.
 */
export function StackedImageGallery({ images = [], altTitle = 'Dokumentasi Pengalaman', companyLogo = null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If no images provided, render a placeholder card
  if (!images || images.length === 0) {
    return (
      <div className="stacked-gallery-placeholder">
        <Layers size={28} className="placeholder-icon" />
        <p>Dokumentasi foto akan segera ditambahkan</p>
      </div>
    );
  }

  const total = images.length;

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const openModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, total]);

  // Normalize companyLogo into an array of logo URLs
  const logoList = React.useMemo(() => {
    if (!companyLogo) return [];
    if (Array.isArray(companyLogo)) return companyLogo.filter(Boolean);
    if (typeof companyLogo === 'string') {
      const trimmed = companyLogo.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch (_) {}
      }
      if (trimmed.includes(',')) {
        return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [trimmed];
    }
    return [];
  }, [companyLogo]);

  return (
    <div className="stacked-gallery-container">
      {/* 3 STACKED CARDS STAGE */}
      <div
        className="stacked-deck"
        onClick={handleNext}
        role="button"
        tabIndex={0}
        aria-label="Klik untuk melihat foto berikutnya"
        title="Klik untuk membuka foto berikutnya, atau klik tombol perbesar untuk melihat layar penuh"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNext();
          }
        }}
      >
        {images.map((item, index) => {
          // Calculate offset relative to activeIndex (0 = top, 1 = mid, 2 = bottom)
          const offset = (index - activeIndex + total) % total;
          
          return (
            <div
              key={index}
              className={`stacked-card stacked-card--offset-${offset}`}
              style={{
                zIndex: total - offset,
              }}
            >
              <div className="stacked-card-inner">
                <img
                  src={item.url}
                  alt={item.title || `${altTitle} - Foto ${index + 1}`}
                  className="stacked-card-img"
                  loading="lazy"
                  decoding="async"
                />
                
                {logoList.length > 0 && offset === 0 && (
                  <div className="stacked-card-overlay">
                    <div className="stacked-card-logos-wrap">
                      {logoList.map((logoUrl, lIdx) => (
                        <div key={lIdx} className="stacked-card-logo" title={altTitle}>
                          <img src={logoUrl} alt={`Logo ${lIdx + 1}`} loading="lazy" decoding="async" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Stack Status Badge */}
        <div className="stacked-controls-bar">
          <div className="stacked-badge">
            <Layers size={13} />
            <span>Foto {activeIndex + 1} dari {total}</span>
            <span className="stacked-hint">• Klik tumpukan foto</span>
          </div>

          <button
            type="button"
            className="stacked-expand-btn"
            onClick={openModal}
            aria-label="Buka galeri penuh foto satu per satu"
            title="Buka galeri penuh foto satu per satu"
          >
            <Maximize2 size={14} />
            <span>Perbesar</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="gallery-modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="gallery-modal-header">
              <div className="gallery-modal-title-wrap">
                <span className="gallery-modal-category">Dokumentasi Pengalaman</span>
                <h4 className="gallery-modal-title">{altTitle}</h4>
              </div>
              <button
                type="button"
                className="gallery-modal-close-btn"
                onClick={closeModal}
                aria-label="Tutup Galeri"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Display Stage */}
            <div className="gallery-modal-stage">
              <button
                type="button"
                className="gallery-nav-btn gallery-nav-prev"
                onClick={handlePrev}
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="gallery-modal-image-wrapper">
                <img
                  src={images[activeIndex]?.url}
                  alt={images[activeIndex]?.title || `Foto ${activeIndex + 1}`}
                  className="gallery-modal-img"
                />
              </div>

              <button
                type="button"
                className="gallery-nav-btn gallery-nav-next"
                onClick={handleNext}
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Modal Footer & Captions */}
            <div className="gallery-modal-footer">
              <div className="gallery-modal-caption-box">
                <div className="gallery-modal-count-pill">
                  Foto {activeIndex + 1} dari {total}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="gallery-thumbnails">
                {images.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-thumbnail-item ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Lihat foto ${idx + 1}`}
                  >
                    <img src={item.url} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
