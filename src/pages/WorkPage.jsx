import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { getProjects } from '@/lib/sanityClient';
import './HomePage.css';

export function WorkPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

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

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ui-ux', label: 'UI/UX Design' },
    { id: 'web', label: 'Web Projects' },
    { id: 'graphic-design', label: 'Graphic Design' },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ maxWidth: '800px', marginBottom: '3.5rem' }}>
          <span className="section-label">Selected Works</span>
          <h1 className="section-title" style={{ fontSize: 'var(--text-h1)', marginBottom: '1.25rem' }}>
            Work & Case Studies
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--muted)' }}>
            A collection of design systems, web development projects, and visual identities crafted with care and functional clarity.
          </p>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '3rem',
          }}
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.id)}
                className="btn btn-sm btn-pill"
                style={{
                  backgroundColor: isActive ? 'var(--inverse)' : 'var(--surface)',
                  color: isActive ? 'var(--inverse-text)' : 'var(--text)',
                  borderColor: isActive ? 'var(--inverse)' : 'var(--line)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const cover = project.coverImage || project.cover_image;
            return (
              <Link
                key={project.id}
                to={`/work/${project.slug}`}
                className="project-card"
                aria-label={`View case study for ${project.title}`}
              >
                <div className="project-card-image-box">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
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

                  <h2 className="project-card-title">{project.title}</h2>
                  <p className="project-card-summary">{project.summary}</p>

                  <div className="project-card-footer">
                    <span>Explore Details</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
