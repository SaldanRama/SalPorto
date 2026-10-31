import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { mockProjects } from '@/data/mockData';
import { getProjects, getProjectBySlug } from '@/lib/sanityClient';
import { Button } from '@/components/ui/Button';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [allProjects, setAllProjects] = useState(mockProjects);
  const [project, setProject] = useState(() =>
    mockProjects.find((p) => p.slug === slug || (slug === 'lakessi' && p.id === 'lakessi'))
  );
  const [isLoading, setIsLoading] = useState(!project);

  // Build formatted Instagram URL if present
  const instagramHref = React.useMemo(() => {
    if (!project?.instagramUrl) return null;
    const raw = project.instagramUrl.trim();
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('@')) return `https://www.instagram.com/${raw.slice(1)}`;
    if (raw.includes('instagram.com')) return `https://${raw}`;
    return `https://www.instagram.com/${raw}`;
  }, [project?.instagramUrl]);

  // Modal / Lightbox State
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    activeIdx: 0,
    images: [],
  });

  const cover = project?.coverImage || project?.cover_image;
  const gallery = Array.isArray(project?.gallery) ? project.gallery : [];

  // Presentation slides (Gambar 2 to N)
  // If gallery[0] is identical to coverImage (like in legacy lakessi mock data where 1.png was both cover and gallery[0]), skip it so cover is not duplicated
  const presentationSlides = React.useMemo(() => {
    if (!Array.isArray(gallery) || gallery.length === 0) return [];
    const firstSrc = gallery[0]?.src || gallery[0]?.url || '';
    if (
      cover &&
      firstSrc &&
      (firstSrc === cover ||
        (typeof firstSrc === 'string' &&
          firstSrc.endsWith('/1.png') &&
          typeof cover === 'string' &&
          cover.endsWith('/1.png')))
    ) {
      return gallery.slice(1);
    }
    return gallery;
  }, [gallery, cover]);

  // Build list of all viewable modal images (Hero cover + presentation slides)
  const allModalImages = React.useMemo(() => {
    const list = [];
    if (cover) {
      list.push({
        src: cover,
        title: project?.title ? `${project.title} — Cover Showcase` : 'Cover Showcase',
        caption: project?.summary || '',
      });
    }
    presentationSlides.forEach((item, idx) => {
      list.push({
        src: item.src || item.url,
        title: item.title || (project?.title ? `${project.title} — Slide 0${idx + 2}` : `Slide 0${idx + 2}`),
        caption: item.caption || '',
      });
    });
    return list;
  }, [cover, presentationSlides, project?.title, project?.summary]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(!project);

    getProjects().then((list) => {
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setAllProjects(list);
      }
    });

    getProjectBySlug(slug).then((found) => {
      if (isMounted) {
        setProject(found);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightbox((prev) => ({ ...prev, isOpen: false }));
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) => ({
          ...prev,
          activeIdx: (prev.activeIdx + 1) % prev.images.length,
        }));
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) => ({
          ...prev,
          activeIdx: (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [lightbox.isOpen, lightbox.images.length]);

  // Ensure all detail container content is immediately revealed when loaded
  useEffect(() => {
    if (!isLoading && project) {
      const timer = setTimeout(() => {
        const els = document.querySelectorAll('.project-detail-container [data-reveal]');
        els.forEach((el) => el.classList.add('is-revealed'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, project]);

  const openLightbox = (index = 0) => {
    if (allModalImages.length === 0) return;
    setLightbox({
      isOpen: true,
      activeIdx: Math.max(0, Math.min(index, allModalImages.length - 1)),
      images: allModalImages,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const nextLightboxImage = (e) => {
    if (e) e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      activeIdx: (prev.activeIdx + 1) % prev.images.length,
    }));
  };

  const prevLightboxImage = (e) => {
    if (e) e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      activeIdx: (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
    }));
  };

  if (isLoading) {
    return (
      <div className="section" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <Sparkles size={32} style={{ marginBottom: '1rem', color: 'var(--accent-strong)' }} />
          <p style={{ fontSize: '1.1rem' }}>Memuat studi kasus...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className="font-serif" style={{ fontSize: 'var(--text-h2)', marginBottom: '1.5rem' }}>
            Project Not Found
          </h1>
          <p style={{ marginBottom: '2rem' }}>
            The requested case study could not be found or has not been published yet.
          </p>
          <Button to="/work" variant="primary">
            <span>Back to All Projects</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="project-detail-article">
      <div className="project-detail-container">
        {/* Back Link */}
        <Link to="/work" className="project-back-link" aria-label="Back to all projects">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>

        {/* Header Metadata */}
        <header className="project-header-section is-revealed" data-reveal="fade-up">
          <div className="project-header-pills">
            <span className="project-cat-badge">
              {project.categoryLabel || project.category || 'Featured Case Study'}
            </span>
            <span className="project-year-badge">{project.year || 2025}</span>
          </div>

          <div className="project-title-row">
            <h1 className="project-main-title">{project.title}</h1>
            {instagramHref && (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="project-instagram-btn"
                title="Buka Instagram Proyek"
                aria-label={`Buka Instagram ${project.title}`}
              >
                <InstagramIcon size={18} className="project-instagram-icon" />
                <span className="project-instagram-label">Instagram</span>
                <ArrowUpRight size={14} className="project-instagram-arrow" />
              </a>
            )}
          </div>

          {/* Hero Visual Showcase (Gambar 1) */}
          <div className="project-hero-media-box is-revealed" data-reveal="fade-up">
            {cover ? (
              <img
                src={cover}
                alt={project.title}
                fetchpriority="high"
                decoding="async"
                className="project-hero-media-img"
                onClick={() => openLightbox(0)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div className="project-card-placeholder-graphic">
                <Sparkles size={40} style={{ color: 'var(--accent-strong)', marginBottom: '1rem' }} />
                <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text)' }}>
                  {project.title} Visual Showcase
                </span>
              </div>
            )}
          </div>

          {project.headline && (
            <p className="project-main-headline">{project.headline}</p>
          )}

          <p className="project-main-summary">{project.summary}</p>
        </header>

        {/* Project Spec Strip */}
        <div className="project-spec-strip is-revealed" data-reveal="fade-up">
          <div>
            <div className="spec-strip-label">Role</div>
            <div className="spec-strip-value">{project.role || 'Lead Designer'}</div>
          </div>
          <div>
            <div className="spec-strip-label">Context / Institution</div>
            <div className="spec-strip-value">{project.projectType || 'Case Study'}</div>
          </div>
          <div>
            <div className="spec-strip-label">Year</div>
            <div className="spec-strip-value">{project.year || '2025'}</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRESENTATION SLIDES SHOWCASE (Images 2 to N)
          Stacked vertically in a seamless, zero-gap layout matching Behance style
         ========================================================================= */}
      {presentationSlides.length > 0 && (
        <section
          className="project-detail-container project-deck-section"
          aria-label="Case Study Presentation Assets"
        >
          <div className="project-slides-vertical-stack">
            {presentationSlides.map((slide, sIdx) => {
              const lightboxIdx = cover ? sIdx + 1 : sIdx;
              return (
                <div
                  key={slide._key || slide.id || sIdx}
                  className="project-slide-item"
                  onClick={() => openLightbox(lightboxIdx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge slide: ${slide.title || project.title || 'Slide'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(lightboxIdx);
                    }
                  }}
                >
                  <img
                    src={slide.src || slide.url}
                    alt={slide.title || `${project.title} presentation slide 0${sIdx + 2}`}
                    loading={sIdx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="project-slide-item-img"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          INTERACTIVE FULLSCREEN LIGHTBOX MODAL
         ========================================================================= */}
      {lightbox.isOpen && (
        <div
          className="project-modal-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution image preview"
        >
          <div className="project-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="project-modal-header">
              <span className="project-modal-title">
                {lightbox.images[lightbox.activeIdx]?.title || project.title}
              </span>
              <button
                type="button"
                className="project-modal-close-btn"
                onClick={closeLightbox}
                aria-label="Close modal preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stage */}
            <div className="project-modal-body">
              {lightbox.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="project-modal-nav-btn project-modal-prev"
                    onClick={prevLightboxImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="project-modal-nav-btn project-modal-next"
                    onClick={nextLightboxImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <img
                src={lightbox.images[lightbox.activeIdx]?.src}
                alt={lightbox.images[lightbox.activeIdx]?.title || 'Enlarged showcase view'}
                className="project-modal-img"
              />
            </div>

            {/* Footer with Caption & Counter */}
            <div className="project-modal-footer">
              <span>{lightbox.images[lightbox.activeIdx]?.caption || ''}</span>
              <span>
                {lightbox.activeIdx + 1} / {lightbox.images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default ProjectDetailPage;
