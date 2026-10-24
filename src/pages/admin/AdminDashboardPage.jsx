import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FolderGit2,
  Image as ImageIcon,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  CheckCircle2,
  X,
  Layers,
  ArrowUpDown,
  Grid,
  List as ListIcon,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getExperiences,
  saveExperience,
  deleteExperience,
  getProjects,
  saveProject,
  deleteProject,
  resolveExperienceLogo,
  urlFor,
  projectId,
  dataset,
} from '@/lib/sanityClient';
import './AdminDashboardPage.css';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('experiences');
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [toastMessage, setToastMessage] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showWidget, setShowWidget] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [expForm, setExpForm] = useState({
    id: '',
    role: '',
    organization: '',
    period: '',
    type: 'Internship',
    isCurrent: false,
    sortOrder: 0,
    description: '',
    jobdesk: [''],
    tools: ['VS Code', 'Figma'],
  });

  const [projForm, setProjForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'ui-ux',
    categoryLabel: 'UI/UX Design',
    year: new Date().getFullYear(),
    role: '',
    projectType: 'Case Study',
    summary: '',
    featured: true,
    published: true,
    sortOrder: 0,
    tags: ['Figma', 'Web'],
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [eList, pList] = await Promise.all([getExperiences(), getProjects()]);
      setExperiences(eList || []);
      setProjects(pList || []);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Close card 3-dots dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Open Add Modal
  const handleOpenAddModal = () => {
    if (activeTab === 'experiences') {
      const nextOrder = experiences.length;
      setEditingItem(null);
      setExpForm({
        id: `exp-${Date.now()}`,
        role: '',
        organization: '',
        period: 'Agustus 2024 — Sekarang',
        type: 'Internship',
        isCurrent: false,
        sortOrder: nextOrder,
        description: '',
        jobdesk: [''],
        tools: ['VS Code', 'Figma'],
      });
    } else {
      setEditingItem(null);
      setProjForm({
        id: `project-${Date.now()}`,
        title: '',
        slug: '',
        category: 'ui-ux',
        categoryLabel: 'UI/UX Design',
        year: new Date().getFullYear(),
        role: '',
        projectType: 'Case Study',
        summary: '',
        featured: true,
        published: true,
        sortOrder: projects.length,
        tags: ['Design', 'Web'],
      });
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditExp = (e, exp) => {
    e.stopPropagation();
    setEditingItem(exp);
    setExpForm({
      id: exp.id || exp._id,
      role: exp.role || '',
      organization: exp.organization || '',
      period: exp.period || '',
      type: exp.type || 'Internship',
      isCurrent: exp.isCurrent ?? exp.is_current ?? false,
      sortOrder: exp.sortOrder ?? exp.sort_order ?? 0,
      description: exp.description || '',
      jobdesk: Array.isArray(exp.jobdesk) && exp.jobdesk.length > 0 ? exp.jobdesk : [''],
      tools: Array.isArray(exp.tools) ? exp.tools : [],
    });
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditProj = (e, proj) => {
    e.stopPropagation();
    setEditingItem(proj);
    setProjForm({
      id: proj.id || proj._id,
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'ui-ux',
      categoryLabel: proj.categoryLabel || 'UI/UX Design',
      year: proj.year || new Date().getFullYear(),
      role: proj.role || '',
      projectType: proj.projectType || 'Case Study',
      summary: proj.summary || '',
      featured: proj.featured ?? true,
      published: proj.published ?? true,
      sortOrder: proj.sortOrder ?? 0,
      tags: Array.isArray(proj.tags) ? proj.tags : [],
    });
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // Save Experience to Sanity
  const handleSaveExpSubmit = async (e) => {
    e.preventDefault();
    if (!expForm.role || !expForm.organization) {
      alert('Mohon isi Job Title dan Nama Instansi.');
      return;
    }

    setIsSaving(true);
    const toSave = {
      ...expForm,
      jobdesk: (expForm.jobdesk || []).filter((j) => j && j.trim() !== ''),
      sortOrder: Number(expForm.sortOrder || 0),
    };

    const res = await saveExperience(toSave);
    setIsSaving(false);

    if (res?.error) {
      alert('Gagal menyimpan ke Sanity: ' + (res.error.message || 'Error'));
      return;
    }

    showToast(`Pengalaman "${toSave.role}" berhasil dipublikasikan ke Sanity!`);
    setIsModalOpen(false);
    await loadData();
  };

  // Save Project to Sanity
  const handleSaveProjSubmit = async (e) => {
    e.preventDefault();
    if (!projForm.title) {
      alert('Mohon isi Judul Proyek.');
      return;
    }

    setIsSaving(true);
    const res = await saveProject(projForm);
    setIsSaving(false);

    if (res?.error) {
      alert('Gagal menyimpan proyek ke Sanity: ' + (res.error.message || 'Error'));
      return;
    }

    showToast(`Proyek "${projForm.title}" berhasil disimpan ke Sanity!`);
    setIsModalOpen(false);
    await loadData();
  };

  // Delete Experience
  const handleDeleteExp = async (e, exp) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (window.confirm(`Yakin ingin menghapus pengalaman "${exp.role}" dari Sanity CMS?`)) {
      const res = await deleteExperience(exp.id || exp._id);
      if (res?.error) {
        alert('Gagal menghapus: ' + res.error.message);
        return;
      }
      showToast(`Pengalaman "${exp.role}" berhasil dihapus.`);
      await loadData();
    }
  };

  // Delete Project
  const handleDeleteProj = async (e, proj) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (window.confirm(`Yakin ingin menghapus proyek "${proj.title}"?`)) {
      const res = await deleteProject(proj.id || proj._id);
      if (res?.error) {
        alert('Gagal menghapus: ' + res.error.message);
        return;
      }
      showToast(`Proyek "${proj.title}" berhasil dihapus.`);
      await loadData();
    }
  };

  // Set as #0 (Top Featured in Homepage Timeline)
  const handleMakeTopFeatured = async (e, exp) => {
    e.stopPropagation();
    setOpenMenuId(null);
    const updated = {
      ...exp,
      sortOrder: 0,
      sort_order: 0,
    };
    await saveExperience(updated);
    showToast(`"${exp.role}" kini menjadi #0 (Posisi teratas di Timeline Beranda)!`);
    await loadData();
  };

  // Filter & Sorting logic
  const filteredExperiences = experiences
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        item.role?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.role || '').localeCompare(b.role || '');
      // default: sortOrder ascending
      return (a.sortOrder ?? a.sort_order ?? 0) - (b.sortOrder ?? b.sort_order ?? 0);
    });

  const filteredProjects = projects
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.categoryLabel?.toLowerCase().includes(q) ||
        item.role?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });

  return (
    <div className="sp-dashboard-root">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="sp-toast">
          <CheckCircle2 size={18} color="#80c5a3" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Window */}
      <div className="sp-dashboard-window">
        {/* ================================================================
            SIDEBAR
            ================================================================ */}
        <aside className="sp-sidebar">
          <div>
            <div className="sp-brand">
              <div className="sp-brand-icon">S</div>
              <div className="sp-brand-info">
                <h2>SalPorto</h2>
                <span>Content Studio</span>
              </div>
            </div>

            <nav className="sp-nav-menu">
              <button
                type="button"
                className={`sp-nav-item ${activeTab === 'experiences' ? 'active' : ''}`}
                onClick={() => setActiveTab('experiences')}
              >
                <Briefcase size={18} />
                <span>Pengalaman</span>
                <span className="sp-nav-badge">{experiences.length}</span>
              </button>

              <button
                type="button"
                className={`sp-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FolderGit2 size={18} />
                <span>Proyek & Studi</span>
                <span className="sp-nav-badge">{projects.length}</span>
              </button>

              <button
                type="button"
                className={`sp-nav-item ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
              >
                <ImageIcon size={18} />
                <span>Media Galeri</span>
              </button>
            </nav>
          </div>

          <div className="sp-sidebar-footer">
            <div className="sp-lake-card">
              <div className="sp-lake-header">
                <span className="sp-pulse-dot" />
                <span>Sanity Content Lake</span>
              </div>
              <div className="sp-lake-details">
                Project: <strong>{projectId}</strong>
                <br />
                Dataset: <strong>{dataset}</strong>
                <br />
                Status: <strong>0s Live Sync (CDN Off)</strong>
              </div>
            </div>

            <Link to="/admin/studio" className="sp-studio-alt-btn">
              <Layers size={14} />
              <span>Buka Sanity Studio Raw ↗</span>
            </Link>
          </div>
        </aside>

        {/* ================================================================
            MAIN WORKSPACE
            ================================================================ */}
        <main className="sp-main">
          {/* Top Header Bar */}
          <header className="sp-topbar">
            <div className="sp-search-bar">
              <Search size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === 'experiences'
                    ? 'Cari jabatan, instansi, atau tipe pengalaman...'
                    : 'Cari judul proyek, kategori, atau tag...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sp-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="sp-topbar-actions">
              <button
                type="button"
                className="sp-btn-create"
                onClick={handleOpenAddModal}
              >
                <Plus size={16} strokeWidth={2.8} />
                <span>
                  {activeTab === 'experiences' ? 'Tambah Pengalaman' : 'Tambah Proyek'}
                </span>
              </button>

              <div className="sp-user-profile">
                <div className="sp-user-avatar">SR</div>
                <div className="sp-user-info">
                  <span className="sp-user-name">Saldan Rama</span>
                  <span className="sp-user-role">Administrator</span>
                </div>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="sp-site-link"
                title="Buka Website Portofolio di tab baru"
              >
                <ExternalLink size={14} />
                <span>Website ↗</span>
              </a>
            </div>
          </header>

          {/* Workspace Body */}
          <div className="sp-workspace">
            {/* Header Title & Sorting Area */}
            <div className="sp-workspace-header">
              <div className="sp-title-area">
                <h1>
                  {activeTab === 'experiences'
                    ? 'Career & Track Record'
                    : activeTab === 'projects'
                    ? 'Projects & Case Studies'
                    : 'Media Assets'}
                </h1>
                <p className="sp-counter-label">
                  Total:{' '}
                  <strong>
                    {activeTab === 'experiences'
                      ? `${filteredExperiences.length} Riwayat Pengalaman`
                      : `${filteredProjects.length} Proyek`}
                  </strong>
                  {activeTab === 'experiences' && (
                    <span> • Posisi [#0], [#1], [#2] otomatis tampil di Timeline Beranda</span>
                  )}
                </p>
              </div>

              <div className="sp-view-controls">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sp-sort-select"
                >
                  <option value="default">Urutan Tampilan (Sort Order)</option>
                  <option value="name">Nama (A — Z)</option>
                </select>

                <div className="sp-view-toggle">
                  <button
                    type="button"
                    className={`sp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    type="button"
                    className={`sp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <ListIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================
                CARD GRID: EXPERIENCES (IDENTICAL TO USER MOCKUP!)
                ============================================================ */}
            {activeTab === 'experiences' && (
              <div className="sp-grid-layout">
                {filteredExperiences.map((exp) => {
                  const logos = resolveExperienceLogo(exp);
                  const firstLogo = Array.isArray(logos) ? logos[0] : logos;
                  const isTopThree = (exp.sortOrder ?? exp.sort_order ?? 99) < 3;
                  const orderNum = exp.sortOrder ?? exp.sort_order ?? 0;

                  return (
                    <div
                      key={exp.id || exp._id}
                      className="sp-doc-card"
                      onClick={(e) => handleOpenEditExp(e, exp)}
                    >
                      {/* Top Row: Big Centered Circular Icon Badge & 3-dots Menu */}
                      <div className="sp-card-top">
                        <div className="sp-icon-circle">
                          {firstLogo ? (
                            <img src={firstLogo} alt={exp.organization} />
                          ) : (
                            <div className="sp-icon-circle fallback-gradient">
                              {(exp.organization || 'E')[0].toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="sp-menu-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === exp.id ? null : exp.id);
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenuId === exp.id && (
                            <div
                              className="sp-menu-dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="sp-menu-item"
                                onClick={(e) => handleOpenEditExp(e, exp)}
                              >
                                <Edit2 size={13} />
                                <span>Edit Pengalaman</span>
                              </button>

                              <button
                                type="button"
                                className="sp-menu-item"
                                onClick={(e) => handleMakeTopFeatured(e, exp)}
                              >
                                <Star size={13} color="#80c5a3" />
                                <span>Jadikan #0 di Home</span>
                              </button>

                              <button
                                type="button"
                                className="sp-menu-item delete"
                                onClick={(e) => handleDeleteExp(e, exp)}
                              >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="sp-card-body">
                        <h3 className="sp-card-title">{exp.role}</h3>
                        <p className="sp-card-org">{exp.organization}</p>
                        <p className="sp-card-period">{exp.period || 'Periode belum diisi'}</p>
                      </div>

                      {/* Card Footer Badges */}
                      <div className="sp-card-footer">
                        {isTopThree ? (
                          <span className="sp-badge-home">⭐ #{orderNum} di Beranda</span>
                        ) : (
                          <span className="sp-badge-order">Posisi #{orderNum}</span>
                        )}
                        <span className="sp-badge-type">{exp.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ============================================================
                CARD GRID: PROJECTS
                ============================================================ */}
            {activeTab === 'projects' && (
              <div className="sp-grid-layout">
                {filteredProjects.map((proj) => {
                  const coverUrl = proj.coverImage || proj.cover_image;
                  return (
                    <div
                      key={proj.id || proj._id}
                      className="sp-doc-card"
                      onClick={(e) => handleOpenEditProj(e, proj)}
                    >
                      <div className="sp-card-top">
                        <div className="sp-icon-circle">
                          {coverUrl ? (
                            <img src={coverUrl} alt={proj.title} />
                          ) : (
                            <div className="sp-icon-circle fallback-gradient">
                              <FolderGit2 size={24} />
                            </div>
                          )}
                        </div>

                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="sp-menu-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === proj.id ? null : proj.id);
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenuId === proj.id && (
                            <div
                              className="sp-menu-dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="sp-menu-item"
                                onClick={(e) => handleOpenEditProj(e, proj)}
                              >
                                <Edit2 size={13} />
                                <span>Edit Proyek</span>
                              </button>
                              <button
                                type="button"
                                className="sp-menu-item delete"
                                onClick={(e) => handleDeleteProj(e, proj)}
                              >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sp-card-body">
                        <h3 className="sp-card-title">{proj.title}</h3>
                        <p className="sp-card-org">{proj.categoryLabel || proj.category}</p>
                        <p className="sp-card-period">Tahun: {proj.year}</p>
                      </div>

                      <div className="sp-card-footer">
                        <span className="sp-badge-home">
                          {proj.published ? '🟢 Live di Website' : 'Draft'}
                        </span>
                        <span className="sp-badge-type">{proj.projectType}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Media Tab Placeholder */}
            {activeTab === 'media' && (
              <div
                style={{
                  background: '#1d1e19',
                  border: '1px solid #2d2f26',
                  borderRadius: '20px',
                  padding: '3rem',
                  textAlign: 'center',
                }}
              >
                <ImageIcon size={48} color="#bfc9ff" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Media & Asset Pipeline
                </h3>
                <p style={{ color: '#8c8c82', maxWidth: '500px', margin: '0 auto' }}>
                  Semua gambar dan dokumentasi diupload langsung ke CDN Sanity Images
                  (cdn.sanity.io) dengan optimasi WebP otomatis.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ================================================================
            FLOATING "SANITY LIVE SYNC" WIDGET (MATCHING BOTTOM-RIGHT MOCKUP)
            ================================================================ */}
        {showWidget && (
          <div className="sp-floating-widget">
            <div className="sp-widget-header">
              <span className="sp-widget-title">
                <Sparkles size={14} color="#bfc9ff" />
                <span>Sanity Live Sync</span>
              </span>
              <button
                type="button"
                className="sp-widget-close"
                onClick={() => setShowWidget(false)}
              >
                <X size={14} />
              </button>
            </div>

            <div className="sp-widget-row">
              <div className="sp-widget-icon">
                <Briefcase size={18} />
              </div>
              <div className="sp-widget-info">
                <span className="sp-widget-name">{experiences.length} Experiences Sync</span>
                <span className="sp-widget-sub">
                  <span className="sp-pulse-dot" style={{ width: 6, height: 6 }} />
                  <span>Real-time ke Sanity Lake</span>
                </span>
              </div>
            </div>

            <a
              href="/experience"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#23251e',
                color: '#bfc9ff',
                padding: '0.5rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Lihat Timeline di Website ↗
            </a>
          </div>
        )}
      </div>

      {/* ================================================================
          MODAL: TAMBAH / EDIT PENGALAMAN
          ================================================================ */}
      {isModalOpen && activeTab === 'experiences' && (
        <div className="sp-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h2 className="sp-modal-title">
                {editingItem ? 'Edit Riwayat Pengalaman' : 'Tambah Pengalaman Baru'}
              </h2>
              <button
                type="button"
                className="sp-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpSubmit}>
              <div className="sp-modal-body">
                <div className="sp-field">
                  <label>Jabatan / Posisi Pekerjaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creative & Media Producer Specialist"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="sp-input"
                  />
                </div>

                <div className="sp-field">
                  <label>Nama Instansi / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PusakaBugis.id (Kemenbud)"
                    value={expForm.organization}
                    onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                    className="sp-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="sp-field">
                    <label>Periode Waktu</label>
                    <input
                      type="text"
                      placeholder="e.g. Agustus 2024 — Sekarang"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                      className="sp-input"
                    />
                  </div>

                  <div className="sp-field">
                    <label>Tipe Pengalaman</label>
                    <select
                      value={expForm.type}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                      className="sp-select"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Kontrak / Contract">Kontrak / Contract</option>
                      <option value="Academic">Academic</option>
                      <option value="Community / Project">Community / Project</option>
                    </select>
                  </div>
                </div>

                <div className="sp-field">
                  <label>
                    Nomor Urutan Tampilan (Sort Order) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={expForm.sortOrder}
                    onChange={(e) =>
                      setExpForm({ ...expForm, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="sp-input"
                  />
                  <span className="sp-field-hint">
                    💡 <strong>Tips:</strong> Angka 0, 1, 2 akan otomatis menjadi <strong>Top 3</strong> yang tampil di Beranda Website!
                  </span>
                </div>

                <div className="sp-field">
                  <label>Ringkasan Tanggung Jawab / Overview</label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi singkat mengenai peran dan pencapaian Anda..."
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="sp-textarea"
                  />
                </div>
              </div>

              <div className="sp-modal-footer">
                <button
                  type="button"
                  className="sp-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="sp-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Menyimpan ke Sanity...' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: TAMBAH / EDIT PROYEK
          ================================================================ */}
      {isModalOpen && activeTab === 'projects' && (
        <div className="sp-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h2 className="sp-modal-title">
                {editingItem ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h2>
              <button
                type="button"
                className="sp-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProjSubmit}>
              <div className="sp-modal-body">
                <div className="sp-field">
                  <label>Judul Proyek *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Redesign SIMRS RSUD Hasanuddin"
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                    className="sp-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="sp-field">
                    <label>Kategori</label>
                    <select
                      value={projForm.category}
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                      className="sp-select"
                    >
                      <option value="ui-ux">UI/UX Design</option>
                      <option value="web">Web Projects</option>
                      <option value="graphic-design">Graphic Design</option>
                    </select>
                  </div>

                  <div className="sp-field">
                    <label>Tahun Pembuatan</label>
                    <input
                      type="number"
                      value={projForm.year}
                      onChange={(e) =>
                        setProjForm({ ...projForm, year: parseInt(e.target.value, 10) })
                      }
                      className="sp-input"
                    />
                  </div>
                </div>

                <div className="sp-field">
                  <label>Ringkasan Proyek</label>
                  <textarea
                    rows={3}
                    placeholder="Ringkasan singkat tentang proyek ini..."
                    value={projForm.summary}
                    onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                    className="sp-textarea"
                  />
                </div>
              </div>

              <div className="sp-modal-footer">
                <button
                  type="button"
                  className="sp-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="sp-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
