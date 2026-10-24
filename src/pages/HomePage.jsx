import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowDown, Sparkles, Layers, Code, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroVisual3D } from '@/components/hero/HeroVisual3D';
import { BiographyBento } from '@/components/biography/BiographyBento';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';
import { mockProjects } from '@/data/mockData';
import { getProjects } from '@/lib/supabaseClient';
import './HomePage.css';

export function HomePage() {
  const [projects, setProjects] = useState(mockProjects);

  useEffect(() => {
    let isMounted = true;
    getProjects().then((data) => {
      if (isMounted && data && data.length > 0) {
        setProjects(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* SECTION 1: TOP 3D STAGE (First screen upon arrival) */}
      <section className="section-hero-stage" aria-label="Hero Visual Stage">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="stage-top-bar" data-reveal="fade-up">
            <span className="pill-badge">
              <span className="dot" aria-hidden="true"></span>
              <span>Available for opportunities & select projects</span>
            </span>
          </div>

          {/* Central 3D Interactive Hero with 6 Orbiting Tools & Dynamic PortoFolio */}
          <div style={{ width: '100%' }} data-reveal="fade-up" data-reveal-delay="100">
            <HeroVisual3D />
          </div>

          {/* Scroll Down Cue */}
          <a href="#about-manifesto" className="stage-scroll-cue" aria-label="Scroll to about section">
            <span>Scroll to explore</span>
            <ArrowDown size={15} className="scroll-cue-icon" />
          </a>
        </div>
      </section>

      {/* SECTION 2: BIOGRAPHY BENTO & CORE PILLARS */}
      <section id="about-manifesto" className="section-manifesto" aria-label="About & Biography">
        <div className="container">
          <div style={{ marginBottom: '2rem' }} data-reveal="fade-up">
            <span className="section-label">01 / Profile &amp; Track Record</span>
          </div>

          {/* Executive Biography Bento Card with Interactive 3D Keyboard */}
          <BiographyBento />

          {/* Capabilities Grid */}
          <div className="capabilities-wrap">
            <div className="capabilities-header-row" data-reveal="fade-up">
              <span className="section-label">Core Pillars</span>
              <h3 className="section-title">What I Bring to the Table</h3>
            </div>

            <div className="capabilities-grid">
              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="100">
                <span className="capability-num">01 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Layers size={18} color="var(--accent-strong)" />
                  <h4 className="capability-title">UI/UX Design</h4>
                </div>
                <p className="capability-desc">
                  Double Diamond methodology, user interviews, wireframing, component design systems, and rapid prototyping in Figma.
                </p>
              </div>

              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="200">
                <span className="capability-num">02 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Code size={18} color="var(--accent-strong)" />
                  <h4 className="capability-title">Front-End Dev</h4>
                </div>
                <p className="capability-desc">
                  Building accessible, performant, and responsive web applications with React, Vite, semantic standards, and fluid CSS.
                </p>
              </div>

              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="300">
                <span className="capability-num">03 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Palette size={18} color="var(--accent-strong)" />
                  <h4 className="capability-title">Graphic Design</h4>
                </div>
                <p className="capability-desc">
                  Visual brand identities, promotional collateral, packaging systems, and editorial typography that communicate clearly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPERIENCE TIMELINE (Vertical Timeline with Point Dots & Stacked Photos) */}
      <ExperienceTimeline />

      {/* SECTION 4: SELECTED WORK (High-contrast card grid showcase) */}
      <section className="section-work-showcase" aria-label="Curated Projects">
        <div className="container">
          <div className="section-header-row" data-reveal="fade-up">
            <div>
              <span className="section-label">03 / Curated Portfolio</span>
              <h2 className="section-title">Selected Work</h2>
            </div>
            <Button to="/work" variant="ghost" size="md">
              <span>View all projects</span>
              <ArrowUpRight size={16} />
            </Button>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => {
              const cover = project.coverImage || project.cover_image;
              return (
                <Link
                  key={project.id}
                  to={`/work/${project.slug}`}
                  className="project-card"
                  aria-label={`View case study for ${project.title}`}
                  data-reveal="fade-up"
                  data-reveal-delay={`${(index + 1) * 150}`}
                >
                  <div className="project-card-image-box">
                    {cover ? (
                      <img
                        src={cover}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div className="project-card-placeholder-graphic">
                        <Sparkles size={28} style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {project.categoryLabel || project.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="project-card-body">
                    <div className="project-card-meta">
                      <span>{project.projectType}</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-summary">{project.summary}</p>

                    <div className="project-card-footer">
                      <span>View Case Study</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
