import React from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroVisual3D } from '@/components/hero/HeroVisual3D';
import { BiographyBento } from '@/components/biography/BiographyBento';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';
import { MiniGalleryCoverflow } from '@/components/gallery/MiniGalleryCoverflow';
import { SelectedWork } from '@/components/work/SelectedWork';
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

      {/* SECTION 2: BIOGRAPHY BENTO & CORE PILLARS */}
      <section id="about-manifesto" className="section-manifesto" aria-label="About & Biography">
        <div className="container">
          <div style={{ marginBottom: '2rem' }} data-reveal="fade-up">
            <span className="section-label">01 / Profile &amp; Track Record</span>
          </div>

          {/* Executive Biography Bento Card with Interactive 3D Keyboard */}
          <BiographyBento />

          {/* MINI GALLERY: 3D COVERFLOW (16:9 PROJECT SHOWCASE) */}
          <div className="mini-gallery-wrap" data-reveal="fade-up">
            <MiniGalleryCoverflow />
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPERIENCE TIMELINE (Vertical Timeline with Point Dots & Stacked Photos) */}
      <ExperienceTimeline />

      {/* SECTION 4: SELECTED WORK (High-impact full-page showcases with distinct theme & custom banner) */}
      <SelectedWork />
    </div>
  );
}
