import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowDown, Sparkles, Layers, Code, Palette, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HeroVisual3D } from '@/components/hero/HeroVisual3D';
import { mockProjects } from '@/data/mockData';
import './HomePage.css';

export function HomePage() {
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

      {/* SECTION 2: ABOUT / MANIFESTO & CAPABILITIES (Distinct Background & 2-Col Layout) */}
      <section id="about-manifesto" className="section-manifesto" aria-label="About & Manifesto">
        <div className="container">
          <div className="manifesto-grid">
            {/* Left Column: Vision Headline & Primary Actions */}
            <div data-reveal="fade-up">
              <span className="section-label">01 / Ethos & Vision</span>
              <h1 className="manifesto-headline">
                Designing digital products with <em>substance</em>, clarity, and intent.
              </h1>
              <div className="manifesto-actions">
                <Button to="/work" variant="primary" size="lg">
                  <span>Explore Selected Work</span>
                  <ArrowRight size={16} />
                </Button>
                <Button to="/about" variant="secondary" size="lg">
                  <span>Full Biography</span>
                  <ArrowUpRight size={16} />
                </Button>
              </div>
            </div>

            {/* Right Column: Bio Narrative & Verified Fast Facts */}
            <div className="manifesto-right-content" data-reveal="fade-up" data-reveal-delay="150">
              <p className="manifesto-bio-p">
                I’m <strong>Saldan Rama</strong>, an Information Systems graduate from <strong>Hasanuddin University</strong> and creative technologist based in Makassar. I combine user-centered design, modern front-end engineering, and graphic craft to build digital experiences that feel human and dependable.
              </p>

              {/* Fast Facts Card */}
              <div className="fast-facts-panel">
                <div>
                  <div className="fact-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={13} color="var(--accent-strong)" />
                    <span>Education</span>
                  </div>
                  <div className="fact-item-value">Bachelor of Information System</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>Hasanuddin University</div>
                </div>

                <div>
                  <div className="fact-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} color="var(--accent-strong)" />
                    <span>Location & Status</span>
                  </div>
                  <div className="fact-item-value">Makassar, Indonesia</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>Open for Freelance & Roles</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="fact-item-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={13} color="var(--accent-strong)" />
                    <span>Core Discipline</span>
                  </div>
                  <div className="fact-item-value">UI/UX Systems • Modern Web Dev • Visual Identity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="capabilities-wrap">
            <div className="capabilities-header-row" data-reveal="fade-up">
              <span className="section-label">Core Pillars</span>
              <h2 className="section-title">What I Bring to the Table</h2>
            </div>

            <div className="capabilities-grid">
              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="100">
                <span className="capability-num">01 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Layers size={18} color="var(--accent-strong)" />
                  <h3 className="capability-title">UI/UX Design</h3>
                </div>
                <p className="capability-desc">
                  Double Diamond methodology, user interviews, wireframing, component design systems, and rapid prototyping in Figma.
                </p>
              </div>

              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="200">
                <span className="capability-num">02 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Code size={18} color="var(--accent-strong)" />
                  <h3 className="capability-title">Front-End Dev</h3>
                </div>
                <p className="capability-desc">
                  Building accessible, performant, and responsive web applications with React, Vite, semantic standards, and fluid CSS.
                </p>
              </div>

              <div className="capability-card" data-reveal="fade-up" data-reveal-delay="300">
                <span className="capability-num">03 / Focus</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Palette size={18} color="var(--accent-strong)" />
                  <h3 className="capability-title">Graphic Design</h3>
                </div>
                <p className="capability-desc">
                  Visual brand identities, promotional collateral, packaging systems, and editorial typography that communicate clearly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SELECTED WORK (High-contrast card grid showcase) */}
      <section className="section-work-showcase" aria-label="Curated Projects">
        <div className="container">
          <div className="section-header-row" data-reveal="fade-up">
            <div>
              <span className="section-label">02 / Curated Portfolio</span>
              <h2 className="section-title">Selected Work</h2>
            </div>
            <Button to="/work" variant="ghost" size="md">
              <span>View all projects</span>
              <ArrowUpRight size={16} />
            </Button>
          </div>

          <div className="projects-grid">
            {mockProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/work/${project.slug}`}
                className="project-card"
                aria-label={`View case study for ${project.title}`}
                data-reveal="fade-up"
                data-reveal-delay={`${(index + 1) * 150}`}
              >
                <div className="project-card-image-box">
                  <div className="project-card-placeholder-graphic">
                    <Sparkles size={28} style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {project.categoryLabel}
                    </span>
                  </div>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
