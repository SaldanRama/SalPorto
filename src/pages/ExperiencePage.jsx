import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Building2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ImagePlus,
} from 'lucide-react';
import { mockExperiences } from '@/data/mockData';
import { getExperiences } from '@/lib/sanityClient';
import { Button } from '@/components/ui/Button';
import { ExperienceTools } from '@/components/experience/ExperienceTools';
import './ExperiencePage.css';

export function ExperiencePage() {
  const [experiences, setExperiences] = useState(mockExperiences);

  // Preview Lightbox Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    images: [],
    activeIndex: 0,
    role: '',
    organization: '',
  });

  const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url || '');

  const openPreview = (images, index, exp) => {
    setPreviewModal({
      isOpen: true,
      images: Array.isArray(images) ? images : [],
      activeIndex: index,
      role: exp.role || 'Dokumentasi Pengalaman',
      organization: exp.organization || '',
    });
  };

  const closePreview = () => {
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    setPreviewModal((prev) => {
      const total = prev.images.length;
      if (total <= 1) return prev;
      return { ...prev, activeIndex: (prev.activeIndex + 1) % total };
    });
  };

  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    setPreviewModal((prev) => {
      const total = prev.images.length;
      if (total <= 1) return prev;
      return { ...prev, activeIndex: (prev.activeIndex - 1 + total) % total };
    });
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!previewModal.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') closePreview();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [previewModal.isOpen, previewModal.images.length]);

  useEffect(() => {
    let isMounted = true;
    getExperiences().then((data) => {
      if (isMounted && data && data.length > 0) {
        setExperiences(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const getIcon = (type) => {
    switch (type) {
      case 'Academic':
        return <GraduationCap size={20} color="var(--accent-strong)" />;
      case 'Internship':
        return <Building2 size={20} color="var(--accent-strong)" />;
      default:
        return <Briefcase size={20} color="var(--accent-strong)" />;
    }
  };

  const sortedExperiences = React.useMemo(() => {
    return [...experiences].sort(
      (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
    );
  }, [experiences]);

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Title */}
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="section-label">Career Journey</span>
          <h1 className="font-serif" style={{ fontSize: 'var(--text-h1)', marginBottom: '1.25rem' }}>
            Experience & Roles
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--muted)', maxWidth: '650px' }}>
            A verified record of academic appointments, public sector internships, and practical technical responsibilities.
          </p>
        </div>

        {/* Timeline / Editorial List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedExperiences.map((exp) => (
            <div
              key={exp.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-subtle)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getIcon(exp.type)}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                      color: 'var(--muted)',
                    }}
                  >
                    {exp.type}
                  </span>
                  {exp.isCurrent && (
                    <span className="pill-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                      <span className="dot" aria-hidden="true"></span>
                      <span>Current</span>
                    </span>
                  )}
                </div>

                <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>
                  {exp.period}
                </span>
              </div>

              <h2 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                {exp.role}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>
                  {exp.organization}
                </span>
                {(() => {
                  const logos = Array.isArray(exp.logo)
                    ? exp.logo
                    : (typeof exp.logo === 'string' && exp.logo.startsWith('[')
                        ? JSON.parse(exp.logo)
                        : (exp.logo ? [exp.logo] : []));
                  return logos.length > 0 ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      {logos.map((l, lIdx) => (
                        <span
                          key={lIdx}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#ffffff',
                            padding: '3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                            border: '1px solid var(--line)',
                          }}
                        >
                          <img src={l} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </span>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>

              {exp.jobdesk && exp.jobdesk.length > 0 ? (
                <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', display: 'block', marginBottom: '0.6rem' }}>
                    Tanggung Jawab &amp; Kontribusi:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {exp.jobdesk.map((jd, jIdx) => (
                      <li key={jIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9375rem', color: 'var(--text)', opacity: 0.88, lineHeight: 1.55 }}>
                        <span style={{ color: 'var(--accent-strong)', fontWeight: 700, marginTop: '0.1rem' }}>✓</span>
                        <span>{jd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ fontSize: '0.975rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  {exp.description}
                </p>
              )}

              {/* Tools & Teknologi yang Digunakan */}
              {(() => {
                const tools =
                  (Array.isArray(exp.tools) && exp.tools.length > 0)
                    ? exp.tools
                    : (mockExperiences.find((m) => m.id === exp.id || m.role?.toLowerCase() === exp.role?.toLowerCase())?.tools || []);
                return tools.length > 0 ? (
                  <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                    <ExperienceTools tools={tools} />
                  </div>
                ) : null;
              })()}

              {exp.images && exp.images.length > 0 && (
                <div className="exp-photos-section">
                  <div className="exp-photos-header">
                    <span className="exp-photos-title">
                      <ImagePlus size={14} />
                      <span>Dokumentasi Kegiatan ({exp.images.length} Foto)</span>
                    </span>
                    <span className="exp-photos-hint">
                      • Klik foto untuk memperbesar / preview
                    </span>
                  </div>

                  <div className="exp-photos-grid">
                    {exp.images.map((img, iIdx) => {
                      const url = getImageUrl(img);
                      return (
                        <button
                          key={iIdx}
                          type="button"
                          className="exp-photo-thumb-btn"
                          onClick={() => openPreview(exp.images, iIdx, exp)}
                          title={`Klik untuk melihat foto ${iIdx + 1} (${exp.role})`}
                          aria-label={`Buka preview foto ${iIdx + 1}`}
                        >
                          <img
                            src={url}
                            alt={`${exp.role} - Foto ${iIdx + 1}`}
                            className="exp-photo-thumb-img"
                            loading="lazy"
                          />
                          <div className="exp-photo-overlay">
                            <span className="exp-photo-zoom-badge">
                              <Maximize2 size={12} />
                              <span>Lihat Foto</span>
                            </span>
                            <span className="exp-photo-num-badge">
                              {iIdx + 1} / {exp.images.length}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ borderTop: '1px solid var(--line)', marginTop: '4rem', paddingTop: '3rem', textAlign: 'center' }}>
          <h3 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            Looking for detailed references or CV?
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1.75rem' }}>
            Complete portfolio dossier and formal resume are available upon inquiry.
          </p>
          <Button to="/contact" variant="primary" size="md">
            <span>Contact Saldan</span>
            <ArrowUpRight size={16} />
          </Button>
        </div>

        {/* PREVIEW LIGHTBOX MODAL */}
        {previewModal.isOpen && previewModal.images.length > 0 && (
          <div
            className="exp-lightbox-backdrop"
            onClick={closePreview}
            role="dialog"
            aria-modal="true"
          >
            <div className="exp-lightbox-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="exp-lightbox-header">
                <div>
                  <span className="exp-lightbox-category">
                    {previewModal.organization || 'Dokumentasi Pengalaman'}
                  </span>
                  <h3 className="exp-lightbox-title">{previewModal.role}</h3>
                </div>
                <button
                  type="button"
                  className="exp-lightbox-close-btn"
                  onClick={closePreview}
                  title="Tutup Preview (Esc)"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stage Image Display */}
              <div className="exp-lightbox-stage">
                {previewModal.images.length > 1 && (
                  <button
                    type="button"
                    className="exp-lightbox-nav-btn exp-lightbox-nav-prev"
                    onClick={handlePrevPhoto}
                    title="Foto Sebelumnya (←)"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                <div className="exp-lightbox-image-wrap">
                  <img
                    src={getImageUrl(previewModal.images[previewModal.activeIndex])}
                    alt={`${previewModal.role} - Foto ${previewModal.activeIndex + 1}`}
                    className="exp-lightbox-img"
                  />
                </div>

                {previewModal.images.length > 1 && (
                  <button
                    type="button"
                    className="exp-lightbox-nav-btn exp-lightbox-nav-next"
                    onClick={handleNextPhoto}
                    title="Foto Selanjutnya (→)"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>

              {/* Modal Footer */}
              <div className="exp-lightbox-footer">
                <div className="exp-lightbox-count-pill">
                  Foto {previewModal.activeIndex + 1} dari {previewModal.images.length}
                </div>

                {/* Thumbnail Strip */}
                {previewModal.images.length > 1 && (
                  <div className="exp-lightbox-thumbnails">
                    {previewModal.images.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`exp-lightbox-thumb-item ${
                          idx === previewModal.activeIndex ? 'active' : ''
                        }`}
                        onClick={() =>
                          setPreviewModal((prev) => ({ ...prev, activeIndex: idx }))
                        }
                        title={`Buka foto ${idx + 1}`}
                        aria-label={`Lihat foto ${idx + 1}`}
                      >
                        <img src={getImageUrl(item)} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
