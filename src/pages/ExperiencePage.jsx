import React from 'react';
import { ArrowUpRight, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { mockExperiences } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

export function ExperiencePage() {
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
          {mockExperiences.map((exp) => (
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
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem' }}>
                {exp.organization}
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

              {exp.images && exp.images.length > 0 && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', display: 'block', marginBottom: '1rem' }}>
                    Dokumentasi Kegiatan ({exp.images.length} Foto):
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {exp.images.map((img, iIdx) => (
                      <div key={iIdx} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--bg)' }}>
                        <img src={img.url} alt={img.title} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', display: 'block' }} />
                        <div style={{ padding: '0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                          {img.title}
                        </div>
                      </div>
                    ))}
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
      </div>
    </div>
  );
}
