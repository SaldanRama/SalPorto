import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { getProjects, getProjectBySlug } from '@/lib/sanityClient';
import { Button } from '@/components/ui/Button';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(() => mockProjects.find((p) => p.slug === slug));

  useEffect(() => {
    let isMounted = true;
    getProjectBySlug(slug).then((found) => {
      if (isMounted && found) {
        setProject(found);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  const cover = project.coverImage || project.cover_image;

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            to="/work"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Header Metadata */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="pill-badge" style={{ marginBottom: '1.25rem' }}>
            {project.categoryLabel || project.category}
          </span>
          <h1
            className="font-serif"
            style={{
              fontSize: 'var(--text-h1)',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
            }}
          >
            {project.title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            {project.summary}
          </p>
        </div>

        {/* Project Spec Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            padding: '1.5rem 0',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
              Role
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{project.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
              Context
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{project.projectType}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
              Year
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{project.year}</div>
          </div>
        </div>

        {/* Hero Visual Showcase */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
            overflow: 'hidden',
            marginBottom: '4rem',
            position: 'relative',
            boxShadow: 'var(--shadow-card)',
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt={project.title}
              fetchpriority="high"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              <Sparkles size={40} style={{ color: 'var(--accent-strong)', marginBottom: '1rem' }} />
              <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text)' }}>
                {project.title} Visual Showcase
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                Case study visual assets & screens preview
              </span>
            </>
          )}
        </div>

        {/* Editorial Body / Process */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: 'var(--text-h3)', marginBottom: '1rem' }}>
              Overview & Problem Definition
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
              This project focused on addressing real challenges through thoughtful design synthesis and iterative development. Designed with structured methodologies like Double Diamond, each decision balances user needs, functional clarity, and aesthetic craftsmanship.
            </p>
          </div>

          <div>
            <h2 className="font-serif" style={{ fontSize: 'var(--text-h3)', marginBottom: '1rem' }}>
              Tags & Methods
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    fontSize: '0.8125rem',
                    color: 'var(--muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
