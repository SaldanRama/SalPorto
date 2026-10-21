import React from 'react';
import { ArrowUpRight, Compass, Code, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BiographyBento } from '@/components/biography/BiographyBento';

export function AboutPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Title */}
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="section-label">Biography & Credentials</span>
          <h1 className="font-serif" style={{ fontSize: 'var(--text-h1)', marginBottom: '1.5rem' }}>
            Bridging design rationale with <span className="font-serif-italic">technical execution</span>.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '800px' }}>
            I’m Saldan Rama, an Information Systems graduate and creative technologist based in Makassar, Indonesia. My work centers on designing intuitive interfaces, engineering clean web experiences, and shaping coherent visual identities.
          </p>
        </div>

        {/* Executive Bento Biography with Interactive 3D Keyboard */}
        <div style={{ marginBottom: '4.5rem' }}>
          <BiographyBento />
        </div>

        {/* Philosophy Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
        >
          <div
            style={{
              padding: '2rem',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
            }}
          >
            <Compass size={24} style={{ color: 'var(--accent-strong)', marginBottom: '1.25rem' }} />
            <h2 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              Substance over Decoration
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.65 }}>
              Good design is not merely aesthetics—it is how clearly a system solves a problem. I rely on methodologies like Double Diamond to research, synthesize, and validate decisions.
            </p>
          </div>

          <div
            style={{
              padding: '2rem',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
            }}
          >
            <Code size={24} style={{ color: 'var(--accent-strong)', marginBottom: '1.25rem' }} />
            <h2 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              Engineering Precision
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.65 }}>
              A design is only as good as its implementation. Building with React, clean semantic markup, and responsive CSS tokens ensures fidelity, accessibility, and smooth performance.
            </p>
          </div>
        </div>

        {/* Core Capabilities */}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '3.5rem', marginBottom: '4.5rem' }}>
          <h2 className="font-serif" style={{ fontSize: 'var(--text-h2)', marginBottom: '2rem' }}>
            Skills & Capabilities
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                UI/UX Design
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--muted)', fontSize: '0.95rem' }}>
                <li>Double Diamond Methodology</li>
                <li>User Research & Interviews</li>
                <li>Wireframing & Prototyping</li>
                <li>Design Systems in Figma</li>
                <li>Usability Testing (SEQ, UMUX-Lite)</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Front-End Engineering
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--muted)', fontSize: '0.95rem' }}>
                <li>React & Vite</li>
                <li>JavaScript (ES6+)</li>
                <li>Semantic HTML & Vanilla CSS</li>
                <li>CSS Custom Properties / Tokens</li>
                <li>Responsive & Accessible UI</li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Graphic Design & Tools
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--muted)', fontSize: '0.95rem' }}>
                <li>Visual Identity & Logos</li>
                <li>Packaging & Print Assets</li>
                <li>Editorial Layout & Typography</li>
                <li>Figma & Adobe Creative Suite</li>
                <li>Git & Version Control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Interested in collaborating?
            </h3>
            <p style={{ color: 'var(--muted)' }}>I'm open to internship roles, freelance projects, and creative inquiries.</p>
          </div>
          <Button to="/contact" variant="primary" size="lg">
            <span>Get in touch</span>
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
