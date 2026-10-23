import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, ArrowUpRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StackedImageGallery } from './StackedImageGallery';
import { mockExperiences } from '@/data/mockData';
import { getExperiences } from '@/lib/supabaseClient';
import './ExperienceTimeline.css';

/**
 * ExperienceTimeline Component
 * Displays the 3 primary experiences in a high-contrast vertical timeline.
 * Features a thin vertical stem line with animated scroll progress that grows when scrolling
 * down and retracts when scrolling up, activating each dot point with a clean white ring
 * matching the user reference image.
 */
export function ExperienceTimeline() {
  const [experiences, setExperiences] = useState(mockExperiences);

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

  const primaryExperiences = experiences.slice(0, 3);
  const stemRef = useRef(null);
  const progressLineRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      // Focal point line positioned at 55% of the viewport height (natural reading line)
      const focalPoint = window.innerHeight * 0.55;

      if (stemRef.current && progressLineRef.current) {
        const rect = stemRef.current.getBoundingClientRect();
        const scrolled = focalPoint - rect.top;
        const totalHeight = rect.height;
        const clampedHeight = Math.max(0, Math.min(totalHeight, scrolled));
        progressLineRef.current.style.height = `${clampedHeight}px`;
      }

      if (nodeRefs.current && nodeRefs.current.length > 0) {
        nodeRefs.current.forEach((el) => {
          if (!el) return;
          const nodeRect = el.getBoundingClientRect();
          const isActive = nodeRect.top + nodeRect.height / 2 <= focalPoint;
          el.classList.toggle('timeline-node--active', isActive);
        });
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateScrollProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section id="experience" className="section-experience" aria-label="Professional Experience">
      <div className="container">
        {/* Section Header */}
        <div className="experience-header" data-reveal="fade-up">
          <div className="experience-header-pill">
            <span className="experience-pill-dot" aria-hidden="true"></span>
            <span>02 / Career &amp; Track Record</span>
          </div>
          <h2 className="experience-title font-serif">
          Experience
          </h2>
        </div>

        {/* Vertical Timeline Track */}
        <div className="timeline-wrapper">
          {/* Continuous thin vertical stem line with scroll progress */}
          <div ref={stemRef} className="timeline-central-stem" aria-hidden="true">
            {/* Base hairline track */}
            <div className="timeline-stem-track"></div>

            {/* Dynamic scroll progress line */}
            <div
              ref={progressLineRef}
              className="timeline-stem-progress"
            >
              {/* Tip marker / small square cap at current progress edge */}
              <div className="timeline-progress-tip"></div>
            </div>

            {/* Small end cap at the bottom of the line */}
            <div className="timeline-stem-end-cap"></div>
          </div>

          <div className="timeline-items-list">
            {primaryExperiences.map((exp, index) => {
              // Determine layout direction:
              // Index 0 (Exp 1): Gallery Left, Content Right
              // Index 1 (Exp 2): Content Left, Gallery Right (Reversed)
              // Index 2 (Exp 3): Gallery Left, Content Right
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp.id || index}
                  className={`timeline-row ${isEven ? 'timeline-row--normal' : 'timeline-row--reversed'}`}
                >
                  {/* LEFT COLUMN */}
                  <div className="timeline-col timeline-col--left">
                    {isEven ? (
                      /* Exp 1 & 3: 3 Stacked Images on Left */
                      <div className="timeline-media-card">
                        <StackedImageGallery
                          images={exp.images}
                          altTitle={exp.role}
                          companyLogo={exp.logo}
                        />
                      </div>
                    ) : (
                      /* Exp 2: Details on Left */
                      <div className="timeline-content-card">
                        <ExperienceContentBody exp={exp} index={index} />
                      </div>
                    )}
                  </div>

                  {/* CENTER COLUMN: POINT DOT ON VERTICAL LINE */}
                  <div className="timeline-col-center">
                    <div
                      ref={(el) => (nodeRefs.current[index] = el)}
                      className="timeline-node"
                      aria-hidden="true"
                    >
                      <span className="timeline-node-dot"></span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="timeline-col timeline-col--right">
                    {isEven ? (
                      /* Exp 1 & 3: Details on Right */
                      <div className="timeline-content-card">
                        <ExperienceContentBody exp={exp} index={index} />
                      </div>
                    ) : (
                      /* Exp 2: 3 Stacked Images on Right */
                      <div className="timeline-media-card">
                        <StackedImageGallery
                          images={exp.images}
                          altTitle={exp.role}
                          companyLogo={exp.logo}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MORE EXPERIENCE ACTION (Minimalist Button & Subtitle) */}
        <div className="timeline-more-section">
          <Link to="/experience" className="timeline-more-btn">
            <span>More Experience</span>
            <ArrowUpRight size={14} />
          </Link>
          <p className="timeline-more-subtitle">
            lihat experience menarik lainnya
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Helper Sub-component for rendering the text content
 * (Job Title, Institution, Period in Months, and Jobdesk List)
 */
function ExperienceContentBody({ exp, index }) {
  return (
    <div className="experience-body-inner">
      {/* 1. Header Meta (Badge & Index) */}
      <div className="experience-top-meta">
        <span className="experience-badge">
          <Building2 size={13} />
          <span>{exp.type || 'Experience'}</span>
        </span>

        {exp.isCurrent && (
          <span className="experience-status-badge">
            <span className="status-dot"></span>
            <span>Aktif / Current</span>
          </span>
        )}
      </div>

      {/* 2. Nama Jabatan (Job Title) */}
      <h3 className="experience-role font-serif">
        {exp.role}
      </h3>

      {/* 3. Nama Instansi (Institution / Company) */}
      <div className="experience-instansi">
        <span className="experience-instansi-name">{exp.organization}</span>
      </div>

      {/* 4. Jangka Waktu Bulan (Duration / Period) */}
      <div className="experience-period">
        <Calendar size={14} className="period-icon" />
        <span className="period-text">{exp.period}</span>
      </div>

      {/* 5. List Jobdesk Yang Dilakukan */}
      <div className="experience-jobdesk-wrap">
        <span className="jobdesk-header-label">Tanggung Jawab &amp; Kontribusi Utama:</span>
        <ul className="experience-jobdesk-list">
          {exp.jobdesk && exp.jobdesk.length > 0 ? (
            exp.jobdesk.map((item, idx) => (
              <li key={idx} className="jobdesk-item">
                <CheckCircle2 size={16} className="jobdesk-check-icon" />
                <span className="jobdesk-text">{item}</span>
              </li>
            ))
          ) : (
            <li className="jobdesk-item">
              <span className="jobdesk-text">{exp.description}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
