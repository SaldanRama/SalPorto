import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Maximize2, X } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { getProjects } from '@/lib/sanityClient';
import './SelectedWork.css';

/**
 * PixelWireframe03 Component
 * Faithful stepped/pixelated wireframe contour of "03"
 * adapting cleanly to light and dark theme palettes.
 */
function PixelWireframe03({ className = '' }) {
  return (
    <svg
      className={`selected-wireframe-03 ${className}`}
      viewBox="0 0 460 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* GLYPH '0' - Stepped Pixelated Outer & Inner Outline */}
      <path
        d="
          M 85 25 
          H 145 V 35 H 160 V 48 H 172 V 64 H 182 V 82 H 190 V 178 H 182 V 196 H 172 V 212 H 160 V 225 H 145 V 235 
          H 85 V 225 H 70 V 212 H 58 V 196 H 48 V 178 H 40 V 82 H 48 V 64 H 58 V 48 H 70 V 35 H 85 Z
          
          M 95 68 
          H 135 V 78 H 145 V 92 H 152 V 168 H 145 V 182 H 135 V 192 
          H 95 V 182 H 85 V 168 H 78 V 92 H 85 V 78 H 95 Z
        "
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* GLYPH '3' - Stepped Pixelated Outer & Inner Loops */}
      <path
        d="
          M 230 25 
          H 320 V 38 H 335 V 54 H 345 V 72 H 352 V 104 H 345 V 116 H 335 V 124 H 318 V 126 H 338 V 134 H 350 V 146 H 358 V 186 H 350 V 206 H 338 V 222 H 322 V 235 
          H 230 V 212 H 280 V 202 H 298 V 192 H 308 V 172 H 298 V 158 H 280 V 150 H 260 V 122 H 285 V 112 H 302 V 96 H 295 V 78 H 280 V 66 H 270 V 54 H 230 Z

          M 270 66 
          H 295 V 78 H 305 V 96 H 295 V 108 H 270 Z

          M 272 152 
          H 298 V 164 H 310 V 186 H 298 V 198 H 272 Z
        "
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SelectedWork() {
  const [projects, setProjects] = useState(() => mockProjects);
  const [modalImage, setModalImage] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getProjects().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        const dummySlugs = new Set(['kelurahan-cantik', 'perdosfit', 'project-kelurahan-cantik', 'project-perdosfit', 'project-umkm-lakessi', 'umkm-lakessi']);
        const clean = data.filter((p) => !dummySlugs.has((p.slug || p.id || '').toLowerCase()));
        setProjects(clean.length > 0 ? clean : mockProjects);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const topProjects = projects.slice(0, 3);

  // Full Screen Session Stacking Scroll Listener:
  // Tracks scroll position within the 300vh track and calculates smooth bottom-to-top stacking.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!trackRef.current) {
            ticking = false;
            return;
          }
          const rect = trackRef.current.getBoundingClientRect();
          const totalScrollable = rect.height - window.innerHeight;

          if (totalScrollable <= 0) {
            ticking = false;
            return;
          }

          // Distance scrolled inside this stacking track
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [topProjects.length]);

  /**
   * Computes precise translateY (sliding up from bottom to top),
   * plus scale & dimming for realistic physical card layering.
   */
  const getCardStyle = (index) => {
    if (topProjects.length <= 1) {
      return { translateY: 0, scale: 1, brightness: 1 };
    }

    const numTransitions = topProjects.length - 1;
    const segSize = 1 / numTransitions;

    // 1. Vertical translation: Card 0 stays at 0. Successive cards rise from 100% to 0%.
    let translateY = 0;
    if (index > 0) {
      const enterStart = (index - 1) * segSize;
      const enterEnd = index * segSize;
      if (scrollProgress < enterStart) {
        translateY = 100; // still hidden below the viewport
      } else if (scrollProgress >= enterEnd) {
        translateY = 0; // fully placed and covering previous card
      } else {
        const t = (scrollProgress - enterStart) / segSize;
        translateY = (1 - t) * 100; // smoothly ascends from 100% to 0%
      }
    }

    // 2. Perspective Scale & Dimming: when this card is covered by the next incoming card
    let scale = 1;
    let brightness = 1;
    if (index < topProjects.length - 1) {
      const coverStart = index * segSize;
      if (scrollProgress > coverStart) {
        const t = Math.min(1, (scrollProgress - coverStart) / segSize);
        scale = 1 - t * 0.05; // scales from 1.0 down to 0.95
        brightness = 1 - t * 0.25; // dims from 1.0 down to 0.75
      }
    }

    return { translateY, scale, brightness };
  };

  return (
    <section
      id="selected-work"
      className="section-selected-work-theme"
      aria-label="Selected Project Showcase"
    >
      {/* Ambient Atmospheric Lighting & Subtle Grid Texture */}
      <div className="selected-work-ambient-mesh" aria-hidden="true" />
      <div className="selected-work-grid-texture" aria-hidden="true" />

      {/* =========================================================================
          FULL-WIDTH SECTION HEADER BANNER (NO SIDE BORDERS)
          Maximizes width across the page with seamless top/bottom lines.
          Title uses `font-serif` ('Instrument Serif') matching other section headers.
         ========================================================================= */}
      <header className="selected-header-banner" data-reveal="fade-up">
        <div className="container selected-banner-inner">
          {/* Giant Stepped Pixel Wireframe "03" in background */}
          <div className="selected-banner-wireframe-wrap">
            <PixelWireframe03 />
          </div>

          {/* Foreground Title & Metadata */}
          <div className="selected-banner-content">
            <div className="selected-banner-left">
              <span className="selected-banner-chip">
                <span className="chip-pulsing-dot" aria-hidden="true" />
                <span>03 / Selected Projects • 2024 — 2025</span>
              </span>

              {/* Title with font-serif: Selected Project */}
              <h2 className="selected-banner-title font-serif">
                <span className="title-row">Selected</span>
                <span className="title-row">Project</span>
              </h2>
            </div>

            {/* Right Side: Minimalist View All Projects Link */}
            <div className="selected-banner-right">
              <Link to="/work" className="selected-banner-cta-btn" aria-label="View all projects">
                <span>View All Projects</span>
                <ArrowUpRight size={14} className="cta-btn-icon" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          FULL-SCREEN SESSION SCROLLING TRACK (STACKING SHOWCASE)
          The 300vh track pins a 100vh viewport where each project card rises
          slowly from bottom to top to overlap and replace the previous one.
         ========================================================================= */}
      <div
        ref={trackRef}
        className="selected-stack-track"
        style={{ height: `${topProjects.length * 100}vh` }}
      >
        <div className="selected-stack-sticky-stage">
          <div className="container selected-stack-container">
            {topProjects.map((project, index) => {
              const cover = project.coverImage || project.cover_image;
              const toolsList =
                Array.isArray(project.tools) && project.tools.length > 0
                  ? project.tools
                  : Array.isArray(project.tags)
                  ? project.tags
                  : ['UI/UX', 'Figma', 'Prototyping'];

              const { translateY, scale, brightness } = getCardStyle(index);

              return (
                <article
                  key={project.id || index}
                  className="selected-stack-card"
                  style={{
                    zIndex: 10 + index,
                    transform: `translate3d(0, ${translateY}%, 0)`,
                  }}
                >
                  {/* 1. FULL-PAGE MOCKUP SHOWCASE CONTAINER */}
                  <div
                    className="selected-stage-media-wrap"
                    style={{
                      transform: `scale(${scale})`,
                      filter: `brightness(${brightness})`,
                    }}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={`Visual showcase mockups for ${project.title}`}
                        className="selected-stage-img"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    ) : (
                      <div className="selected-stage-placeholder">
                        <Sparkles size={48} className="placeholder-sparkle" />
                        <h4 className="placeholder-title">{project.title}</h4>
                        <p className="placeholder-sub">Full page showcase mockup preview</p>
                      </div>
                    )}

                    {/* Gradient Scrim for readable contrast */}
                    <div className="selected-stage-scrim" aria-hidden="true" />

                    {/* Full View Expand Button (Top Right) */}
                    {cover && (
                      <button
                        type="button"
                        className="selected-stage-zoom-btn"
                        title="View full resolution mockup"
                        aria-label="View full resolution mockup"
                        onClick={() => setModalImage(cover)}
                      >
                        <Maximize2 size={16} />
                        <span className="zoom-text">Full View</span>
                      </button>
                    )}

                    {/* Showcase Index Pill (Top Left) */}
                    <div className="selected-stage-index-badge">
                      <span>Project 0{index + 1} of 0{topProjects.length}</span>
                    </div>

                    {/* 2. FLOATING CARD OVER THE SHOWCASE (Matching Image 1) */}
                    <div className="selected-floating-card">
                      <div className="selected-card-inner">
                        {/* Project Name (Heading) */}
                        <div className="selected-card-title-group">
                          <div className="selected-card-category">
                            {project.categoryLabel || project.category || 'Featured Case Study'}
                          </div>
                          <h3 className="selected-card-title">{project.title}</h3>
                        </div>

                        {/* Project Problem / Headline / Description */}
                        {project.headline && (
                          <p className="selected-card-headline">{project.headline}</p>
                        )}
                        <p className="selected-card-desc">{project.summary}</p>

                        {/* Role & Year Badges */}
                        <div className="selected-card-meta-row">
                          <span className="selected-meta-badge role-badge">
                            {project.role || 'Lead Designer'}
                          </span>
                          <span className="selected-meta-badge year-badge">
                            {project.year || '2025'}
                          </span>
                        </div>

                        {/* Tools Used Section */}
                        <div className="selected-card-tools-section">
                          <span className="selected-tools-label">Tools &amp; Stack:</span>
                          <div className="selected-tools-tags">
                            {toolsList.map((tool, tIdx) => (
                              <span key={tIdx} className="selected-tool-tag">
                                <span className="tool-indicator-dot" aria-hidden="true" />
                                <span>{tool}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Button: View Case Study */}
                        <div className="selected-card-footer">
                          <Link
                            to={`/work/${project.slug}`}
                            className="selected-view-project-btn"
                            aria-label={`View case study for ${project.title}`}
                          >
                            <span className="btn-text">View Full Case Study</span>
                            <span className="btn-arrow-wrap">
                              <ArrowUpRight size={18} className="btn-arrow" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container">
        {/* SECTION FOOTER CTA (100% Consistent English) */}
        <div className="selected-footer-cta-box" data-reveal="fade-up">
          <div className="footer-cta-text-wrap">
            <h4 className="footer-cta-heading">Looking for more case studies?</h4>
            <p className="footer-cta-sub">
              Browse the complete archive of web applications, design systems, and digital products.
            </p>
          </div>
          <Link to="/work" className="selected-cta-primary-btn">
            <span>Explore All Projects</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* FULL VIEW MODAL LIGHTBOX */}
      {modalImage && (
        <div
          className="selected-lightbox-backdrop"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="selected-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="selected-lightbox-close"
              onClick={() => setModalImage(null)}
              aria-label="Close preview"
            >
              <X size={24} />
            </button>
            <img
              src={modalImage}
              alt="Full resolution project showcase preview"
              className="selected-lightbox-img"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default SelectedWork;