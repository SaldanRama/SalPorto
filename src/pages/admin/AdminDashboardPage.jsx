import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Check,
  Tag,
  ListTodo,
  Camera,
  Building,
  LayoutGrid,
  List,
} from 'lucide-react';
import { getToolLogo } from '@/components/experience/ExperienceTools';
import {
  getExperiences,
  saveExperience,
  deleteExperience,
  getProjects,
  saveProject,
  deleteProject,
  uploadImageToSanity,
  resolveExperienceLogo,
  projectId,
  dataset,
} from '@/lib/sanityClient';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import './AdminDashboardPage.css';

// Popular Tools Preset for 1-Click Selection
const PRESET_TOOLS = [
  'VS Code',
  'Figma',
  'Photoshop',
  'Affinity',
  'Canva',
  'CapCut',
  'React',
  'JavaScript',
  'HTML',
  'CSS',
  'Notion',
  'Microsoft Excel',
];

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customToolInput, setCustomToolInput] = useState('');
  const fileInputRef = useRef(null);

  // Experience Form State
  const [expForm, setExpForm] = useState({
    id: '',
    role: '',
    organization: '',
    period: 'Agustus 2024 — Sekarang',
    type: 'Internship',
    isCurrent: false,
    sortOrder: 0,
    description: '',
    jobdesk: [''],
    tools: ['VS Code', 'Figma'],
    images: [],
    logos: [],
  });

  // Project Form State
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
    coverImage: '',
    featured: true,
    published: true,
    sortOrder: 0,
    tags: ['Design', 'Web'],
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
      setCustomToolInput('');
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
        images: [],
        logos: [],
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
        coverImage: '',
        featured: true,
        published: true,
        sortOrder: projects.length,
        tags: ['Design', 'Web'],
      });
    }
    setIsModalOpen(true);
  };

  // Open Edit Experience Modal
  const handleOpenEditExp = (e, exp) => {
    e.stopPropagation();
    setEditingItem(exp);
    setCustomToolInput('');
    setExpForm({
      id: exp.id || exp._id,
      role: exp.role || '',
      organization: exp.organization || '',
      period: exp.period || '',
      type: exp.type || 'Internship',
      isCurrent: exp.isCurrent ?? exp.is_current ?? false,
      sortOrder: exp.sortOrder ?? exp.sort_order ?? 0,
      description: exp.description || '',
      jobdesk:
        Array.isArray(exp.jobdesk) && exp.jobdesk.length > 0 ? [...exp.jobdesk] : [''],
      tools: Array.isArray(exp.tools) ? [...exp.tools] : [],
      images: Array.isArray(exp.images) ? [...exp.images] : [],
      logos: exp.logos || [],
    });
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // Open Edit Project Modal
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
      coverImage: proj.coverImage || proj.cover_image || '',
      featured: proj.featured ?? true,
      published: proj.published ?? true,
      sortOrder: proj.sortOrder ?? 0,
      tags: Array.isArray(proj.tags) ? [...proj.tags] : [],
    });
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // Jobdesk point list helpers
  const handleAddJobdeskPoint = () => {
    setExpForm((prev) => ({
      ...prev,
      jobdesk: [...(prev.jobdesk || []), ''],
    }));
  };

  const handleUpdateJobdeskPoint = (index, value) => {
    setExpForm((prev) => {
      const updated = [...(prev.jobdesk || [])];
      updated[index] = value;
      return { ...prev, jobdesk: updated };
    });
  };

  const handleRemoveJobdeskPoint = (index) => {
    setExpForm((prev) => {
      const updated = (prev.jobdesk || []).filter((_, i) => i !== index);
      return { ...prev, jobdesk: updated.length > 0 ? updated : [''] };
    });
  };

  // Tool tags helpers
  const handleToggleTool = (toolName) => {
    setExpForm((prev) => {
      const cur = prev.tools || [];
      if (cur.includes(toolName)) {
        return { ...prev, tools: cur.filter((t) => t !== toolName) };
      }
      return { ...prev, tools: [...cur, toolName] };
    });
  };

  const handleAddCustomTool = (e) => {
    if (e) e.preventDefault();
    const trimmed = customToolInput.trim();
    if (!trimmed) return;
    if (!expForm.tools?.includes(trimmed)) {
      setExpForm((prev) => ({
        ...prev,
        tools: [...(prev.tools || []), trimmed],
      }));
    }
    setCustomToolInput('');
  };

  // Image upload handler (uploads directly to Sanity CDN pipeline)
  const processPhotoFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setUploadingImage(true);
    let count = 0;
    const uploadedPhotos = [];

    for (const file of files) {
      try {
        const res = await uploadImageToSanity(file);
        if (res?.asset) {
          count++;
          uploadedPhotos.push({
            url: res.url,
            _id: res.asset._id,
            title: file.name.replace(/\.[^/.]+$/, ''),
            caption: '',
          });
        }
      } catch (err) {
        console.error('Gagal mengunggah foto:', file.name, err);
      }
    }

    if (uploadedPhotos.length > 0) {
      setExpForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedPhotos],
      }));
      showToast(`${count} foto berhasil diunggah ke Sanity CDN!`);
    }

    setUploadingImage(false);
  };

  const handleUploadDocPhotos = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processPhotoFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processPhotoFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveDocPhoto = (index) => {
    setExpForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Save Experience to Sanity
  const handleSaveExpSubmit = async (e) => {
    e.preventDefault();
    if (!expForm.role || !expForm.organization) {
      alert('Mohon isi Jabatan dan Nama Instansi.');
      return;
    }

    setIsSaving(true);
    const cleanJobdesk = (expForm.jobdesk || []).filter((j) => j && j.trim() !== '');

    const toSave = {
      ...expForm,
      jobdesk: cleanJobdesk,
      sortOrder: Number(expForm.sortOrder || 0),
    };

    const res = await saveExperience(toSave);
    setIsSaving(false);

    if (res?.error) {
      alert('Gagal menyimpan ke Sanity: ' + (res.error.message || 'Error'));
      return;
    }

    showToast(`Pengalaman "${toSave.role}" berhasil disimpan ke Sanity!`);
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
      alert('Gagal menyimpan proyek: ' + (res.error.message || 'Error'));
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

  // Filter & Sorting
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
    <div className="sp-fullscreen-app">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="sp-toast-notification">
          <CheckCircle2 size={18} color="#80c5a3" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          LEFT SIDEBAR (FULLSCREEN HEIGHT, FLUSH TO LEFT EDGE)
          ==================================================================== */}
      <aside className="sp-fullscreen-sidebar">
        <div>
          <div className="sp-sidebar-brand">
            <div className="sp-sidebar-brand-icon">S</div>
            <div className="sp-sidebar-brand-text">
              <h2>SalPorto</h2>
              <span>Content Studio</span>
            </div>
          </div>

          <nav className="sp-sidebar-nav">
            <button
              type="button"
              className={`sp-sidebar-btn ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              <Briefcase size={18} />
              <span>Pengalaman</span>
              <span className="sp-sidebar-badge">{experiences.length}</span>
            </button>

            <button
              type="button"
              className={`sp-sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderGit2 size={18} />
              <span>Proyek & Karya</span>
              <span className="sp-sidebar-badge">{projects.length}</span>
            </button>

            <button
              type="button"
              className={`sp-sidebar-btn ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImageIcon size={18} />
              <span>Media Galeri</span>
            </button>
          </nav>
        </div>

        <div className="sp-sidebar-bottom">
          <div className="sp-lake-status-pill">
            <div className="sp-status-indicator">
              <span className="sp-pulse-dot" />
              <span>Sanity Lake Active</span>
            </div>
            <div className="sp-lake-info">
              Dataset: <strong>{dataset}</strong> • <strong>0s Live Sync</strong>
            </div>
          </div>

          <Link to="/admin/studio" className="sp-studio-link-btn" title="Buka Sanity Studio Bawaan">
            <Layers size={14} />
            <span>Sanity Studio Raw ↗</span>
          </Link>
        </div>
      </aside>

      {/* ====================================================================
          MAIN VIEWPORT (SPACIOUS, MINIMALIST, EDGE-TO-EDGE)
          ==================================================================== */}
      <main className="sp-viewport-main">
        {/* Sticky Topbar */}
        <header className="sp-fullscreen-topbar">
          <div className="sp-search-capsule">
            <Search size={16} />
            <input
              type="text"
              placeholder={
                activeTab === 'experiences'
                  ? 'Cari pengalaman, nama instansi, atau role...'
                  : 'Cari proyek atau kategori...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sp-search-input-field"
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

          <div className="sp-topbar-right-actions">
            <button
              type="button"
              className="sp-btn-primary-create"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} strokeWidth={2.8} />
              <span>
                {activeTab === 'experiences' ? 'Tambah Pengalaman' : 'Tambah Proyek'}
              </span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="sp-site-external-btn"
              title="Buka Website Portofolio di Tab Baru"
            >
              <ExternalLink size={14} />
              <span>Website ↗</span>
            </a>
          </div>
        </header>

        {/* Content Workspace */}
        <div className="sp-fullscreen-content">
          <div className="sp-content-header">
            <div>
              <h1>
                {activeTab === 'experiences'
                  ? 'Career & Track Record'
                  : activeTab === 'projects'
                  ? 'Projects & Case Studies'
                  : 'Media Assets'}
              </h1>
              <p className="sp-content-subtitle">
                Total:{' '}
                <strong>
                  {activeTab === 'experiences'
                    ? `${filteredExperiences.length} Riwayat Pengalaman`
                    : `${filteredProjects.length} Proyek`}
                </strong>
                {activeTab === 'experiences' && (
                  <span> • Urutan [#0], [#1], [#2] otomatis tampil di Timeline Beranda Website</span>
                )}
              </p>
            </div>

            <div className="sp-controls-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sp-select-minimal"
              >
                <option value="default">Urutan Tampilan (Sort Order)</option>
                <option value="name">Nama Jabatan (A — Z)</option>
              </select>

              <div className="sp-view-toggle-pill">
                <button
                  type="button"
                  className={`sp-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Tampilan Kartu (Grid View)"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`sp-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Tampilan Daftar / Tabel (List View)"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ================================================================
              EXPERIENCES GRID (SPACIOUS, AIRY, MINIMALIST)
              ================================================================ */}
          {activeTab === 'experiences' && viewMode === 'grid' && (
            <div className="sp-cards-grid">
              {filteredExperiences.map((exp) => {
                const logos = resolveExperienceLogo(exp);
                const firstLogo = Array.isArray(logos) ? logos[0] : logos;
                const isTopThree = (exp.sortOrder ?? exp.sort_order ?? 99) < 3;
                const orderNum = exp.sortOrder ?? exp.sort_order ?? 0;
                const photosCount = Array.isArray(exp.images) ? exp.images.length : 0;
                const jobdeskItems = Array.isArray(exp.jobdesk) ? exp.jobdesk.slice(0, 2) : [];

                return (
                  <div
                    key={exp.id || exp._id}
                    className="sp-card-item"
                    onClick={(e) => handleOpenEditExp(e, exp)}
                  >
                    {/* Header: Centered Circle Logo & Menu */}
                    <div className="sp-card-item-header">
                      <div className="sp-logo-circle">
                        {firstLogo ? (
                          <img src={firstLogo} alt={exp.organization} />
                        ) : (
                          <div className="sp-logo-circle text-fallback">
                            {(exp.organization || 'E')[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="sp-card-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === exp.id ? null : exp.id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === exp.id && (
                          <div
                            className="sp-card-dropdown"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="sp-dropdown-action"
                              onClick={(e) => handleOpenEditExp(e, exp)}
                            >
                              <Edit2 size={13} />
                              <span>Edit Pengalaman</span>
                            </button>

                            <button
                              type="button"
                              className="sp-dropdown-action"
                              onClick={(e) => handleMakeTopFeatured(e, exp)}
                            >
                              <Star size={13} color="#80c5a3" />
                              <span>Jadikan #0 di Beranda</span>
                            </button>

                            <button
                              type="button"
                              className="sp-dropdown-action danger"
                              onClick={(e) => handleDeleteExp(e, exp)}
                            >
                              <Trash2 size={13} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="sp-card-body-content">
                      <h3 className="sp-card-role-title">{exp.role}</h3>
                      <p className="sp-card-org-name">{exp.organization}</p>
                      <p className="sp-card-period-date">{exp.period || 'Periode belum diisi'}</p>

                      {/* Jobdesk Bullets Preview */}
                      {jobdeskItems.length > 0 && (
                        <ul className="sp-card-jobdesk-preview">
                          {jobdeskItems.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}

                      {/* Tool Chips Preview with Logos */}
                      {Array.isArray(exp.tools) && exp.tools.length > 0 && (
                        <div className="sp-card-tools-strip">
                          {exp.tools.slice(0, 3).map((tool, i) => (
                            <span key={i} className="sp-mini-tool-chip" title={tool}>
                              <span className="sp-mini-tool-logo">{getToolLogo(tool)}</span>
                              <span>{tool}</span>
                            </span>
                          ))}
                          {exp.tools.length > 3 && (
                            <span className="sp-mini-tool-more">+{exp.tools.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="sp-card-footer-strip">
                      {isTopThree ? (
                        <span className="sp-pill-home-badge">⭐ #{orderNum} di Beranda</span>
                      ) : (
                        <span className="sp-pill-order-badge">Posisi #{orderNum}</span>
                      )}

                      {photosCount > 0 && (
                        <span className="sp-photos-count-badge">
                          <Camera size={13} />
                          <span>{photosCount} Foto</span>
                        </span>
                      )}

                      <span style={{ fontSize: '0.75rem', color: '#8c8c82' }}>{exp.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================================================================
              EXPERIENCES: LIST VIEW TABLE
              ================================================================ */}
          {activeTab === 'experiences' && viewMode === 'list' && (
            <div className="sp-list-table-container">
              <table className="sp-list-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Urutan</th>
                    <th>Pengalaman / Jabatan</th>
                    <th>Instansi</th>
                    <th>Periode</th>
                    <th>Tipe</th>
                    <th>Tools</th>
                    <th>Dokumentasi</th>
                    <th style={{ width: '100px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExperiences.map((exp) => {
                    const logos = resolveExperienceLogo(exp);
                    const firstLogo = Array.isArray(logos) ? logos[0] : logos;
                    const isTopThree = (exp.sortOrder ?? exp.sort_order ?? 99) < 3;
                    const orderNum = exp.sortOrder ?? exp.sort_order ?? 0;
                    const photosCount = Array.isArray(exp.images) ? exp.images.length : 0;

                    return (
                      <tr key={exp.id || exp._id} onClick={(e) => handleOpenEditExp(e, exp)}>
                        <td>
                          {isTopThree ? (
                            <span className="sp-pill-home-badge">⭐ #{orderNum}</span>
                          ) : (
                            <span className="sp-pill-order-badge">#{orderNum}</span>
                          )}
                        </td>
                        <td>
                          <div className="sp-list-role-cell">
                            <div className="sp-list-logo-box">
                              {firstLogo ? (
                                <img src={firstLogo} alt={exp.organization} />
                              ) : (
                                <span>{(exp.organization || 'E')[0].toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <div className="sp-list-role-title">{exp.role}</div>
                              {exp.isCurrent && (
                                <span className="sp-list-active-tag">🟢 Aktif</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sp-list-org-text">{exp.organization}</span>
                        </td>
                        <td>
                          <span className="sp-list-period-text">{exp.period || '—'}</span>
                        </td>
                        <td>
                          <span className="sp-list-type-badge">{exp.type}</span>
                        </td>
                        <td>
                          <div className="sp-card-tools-strip">
                            {(exp.tools || []).slice(0, 3).map((tool, i) => (
                              <span key={i} className="sp-mini-tool-chip" title={tool}>
                                <span className="sp-mini-tool-logo">{getToolLogo(tool)}</span>
                                <span>{tool}</span>
                              </span>
                            ))}
                            {(exp.tools || []).length > 3 && (
                              <span className="sp-mini-tool-more">+{exp.tools.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {photosCount > 0 ? (
                            <span className="sp-photos-count-badge">
                              <Camera size={13} />
                              <span>{photosCount} Foto</span>
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--sp-subtle)' }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="sp-list-actions-cell" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="sp-list-btn"
                              onClick={(e) => handleOpenEditExp(e, exp)}
                              title="Edit Pengalaman"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="sp-list-btn star"
                              onClick={(e) => handleMakeTopFeatured(e, exp)}
                              title="Jadikan #0 di Beranda"
                            >
                              <Star size={14} />
                            </button>
                            <button
                              type="button"
                              className="sp-list-btn delete"
                              onClick={(e) => handleDeleteExp(e, exp)}
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              PROJECTS: GRID & LIST VIEW
              ================================================================ */}
          {activeTab === 'projects' && viewMode === 'grid' && (
            <div className="sp-cards-grid">
              {filteredProjects.map((proj) => {
                const coverUrl = proj.coverImage || proj.cover_image;
                return (
                  <div
                    key={proj.id || proj._id}
                    className="sp-card-item"
                    onClick={(e) => handleOpenEditProj(e, proj)}
                  >
                    <div className="sp-card-item-header">
                      <div className="sp-logo-circle">
                        {coverUrl ? (
                          <img src={coverUrl} alt={proj.title} />
                        ) : (
                          <div className="sp-logo-circle text-fallback">
                            <FolderGit2 size={24} />
                          </div>
                        )}
                      </div>

                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="sp-card-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === proj.id ? null : proj.id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === proj.id && (
                          <div
                            className="sp-card-dropdown"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="sp-dropdown-action"
                              onClick={(e) => handleOpenEditProj(e, proj)}
                            >
                              <Edit2 size={13} />
                              <span>Edit Proyek</span>
                            </button>
                            <button
                              type="button"
                              className="sp-dropdown-action danger"
                              onClick={(e) => handleDeleteProj(e, proj)}
                            >
                              <Trash2 size={13} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sp-card-body-content">
                      <h3 className="sp-card-role-title">{proj.title}</h3>
                      <p className="sp-card-org-name">{proj.categoryLabel || proj.category}</p>
                      <p className="sp-card-period-date">Tahun: {proj.year}</p>
                    </div>

                    <div className="sp-card-footer-strip">
                      <span className="sp-pill-home-badge">
                        {proj.published ? '🟢 Live di Website' : 'Draft'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#8c8c82' }}>
                        {proj.projectType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================================================================
              PROJECTS: LIST VIEW TABLE
              ================================================================ */}
          {activeTab === 'projects' && viewMode === 'list' && (
            <div className="sp-list-table-container">
              <table className="sp-list-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Urutan</th>
                    <th>Judul Proyek</th>
                    <th>Kategori</th>
                    <th>Tahun</th>
                    <th>Tipe Proyek</th>
                    <th>Status</th>
                    <th style={{ width: '100px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => {
                    const coverUrl = proj.coverImage || proj.cover_image;
                    return (
                      <tr key={proj.id || proj._id} onClick={(e) => handleOpenEditProj(e, proj)}>
                        <td>
                          <span className="sp-pill-order-badge">#{proj.sortOrder ?? 0}</span>
                        </td>
                        <td>
                          <div className="sp-list-role-cell">
                            <div className="sp-list-logo-box">
                              {coverUrl ? (
                                <img src={coverUrl} alt={proj.title} />
                              ) : (
                                <FolderGit2 size={18} />
                              )}
                            </div>
                            <div>
                              <div className="sp-list-role-title">{proj.title}</div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--sp-muted)' }}>
                                {proj.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sp-list-type-badge">
                            {proj.categoryLabel || proj.category}
                          </span>
                        </td>
                        <td>
                          <span className="sp-list-period-text">{proj.year}</span>
                        </td>
                        <td>
                          <span className="sp-list-org-text">{proj.projectType}</span>
                        </td>
                        <td>
                          <span className="sp-pill-home-badge">
                            {proj.published ? '🟢 Live' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="sp-list-actions-cell" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="sp-list-btn"
                              onClick={(e) => handleOpenEditProj(e, proj)}
                              title="Edit Proyek"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="sp-list-btn delete"
                              onClick={(e) => handleDeleteProj(e, proj)}
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Media Tab Placeholder */}
          {activeTab === 'media' && (
            <div
              style={{
                background: '#141512',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '4rem 2rem',
                textAlign: 'center',
              }}
            >
              <ImageIcon size={48} color="#bfc9ff" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Sanity Media & Image Asset Pipeline
              </h3>
              <p style={{ color: '#8c8c82', maxWidth: '520px', margin: '0 auto' }}>
                Semua file dokumentasi dan logo tersimpan di Content Delivery Network Sanity (CDN)
                dengan kompresi WebP otomatis untuk kecepatan loading maksimal.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================================
          MODAL DIALOG (SPACIOUS, COMPLETE RICH FIELDS)
          ==================================================================== */}
      {isModalOpen && activeTab === 'experiences' && (
        <div className="sp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h2>{editingItem ? 'Edit Riwayat Pengalaman' : 'Tambah Pengalaman Baru'}</h2>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="sp-modal-form" onSubmit={handleSaveExpSubmit}>
              <div className="sp-modal-scroll-body">
                {/* SECTION 1: INFORMASI UTAMA */}
                <div className="sp-form-section">
                  <h3 className="sp-section-heading">
                    <Building size={16} />
                    <span>1. Informasi Pokok & Jabatan</span>
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="sp-input-label">Jabatan / Posisi Pekerjaan *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Creative & Media Producer Specialist"
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>

                    <div>
                      <label className="sp-input-label">Nama Instansi / Perusahaan *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PusakaBugis.id (Kemenbud)"
                        value={expForm.organization}
                        onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="sp-input-label">Periode Waktu</label>
                      <input
                        type="text"
                        placeholder="e.g. Agustus 2024 — Sekarang"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>

                    <div>
                      <label className="sp-input-label">Tipe Pengalaman</label>
                      <select
                        value={expForm.type}
                        onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                        className="sp-select-field"
                      >
                        <option value="Internship">Internship</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Kontrak / Contract">Kontrak / Contract</option>
                        <option value="Academic">Academic</option>
                        <option value="Community / Project">Community / Project</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="sp-input-label">
                        <span>Nomor Urutan Tampilan (Sort Order) *</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={expForm.sortOrder}
                        onChange={(e) =>
                          setExpForm({
                            ...expForm,
                            sortOrder: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="sp-input-field"
                      />
                      <span style={{ fontSize: '0.725rem', color: '#8c8c82', marginTop: '4px', display: 'block' }}>
                        💡 Urutan 0, 1, 2 akan otomatis menjadi Top 3 yang tampil di Beranda!
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={expForm.isCurrent}
                          onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: '#bfc9ff' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f2ec' }}>
                          Masih aktif menjalani posisi ini (Current Role)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: TANGGUNG JAWAB & JOBDESK (LIST DINAMIS, BUKAN PARAGRAF) */}
                <div className="sp-form-section">
                  <h3 className="sp-section-heading">
                    <ListTodo size={16} />
                    <span>2. Tanggung Jawab & Lingkup Kontribusi (List Poin)</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#8c8c82', margin: '0 0 0.5rem 0' }}>
                    Tuliskan poin-poin fokus atau tanggung jawab utama Anda. Poin ini akan tampil dengan bullet dot yang rapi di website.
                  </p>

                  <div className="sp-jobdesk-rows">
                    {(expForm.jobdesk || []).map((point, idx) => (
                      <div key={idx} className="sp-jobdesk-row">
                        <span className="sp-bullet-dot" />
                        <input
                          type="text"
                          placeholder={`Poin ${idx + 1}: e.g. Merancang antarmuka pengguna responsif...`}
                          value={point}
                          onChange={(e) => handleUpdateJobdeskPoint(idx, e.target.value)}
                          className="sp-input-field"
                        />
                        <button
                          type="button"
                          className="sp-row-delete-btn"
                          onClick={() => handleRemoveJobdeskPoint(idx)}
                          title="Hapus poin ini"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="sp-btn-add-item"
                    onClick={handleAddJobdeskPoint}
                  >
                    <Plus size={14} />
                    <span>Tambah Poin Tanggung Jawab</span>
                  </button>
                </div>

                {/* SECTION 3: TOOLS & CREATIVE STACK (TAGS) */}
                <div className="sp-form-section">
                  <h3 className="sp-section-heading">
                    <Tag size={16} />
                    <span>3. Tools & Software yang Digunakan</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--sp-muted)', margin: '0 0 0.65rem 0' }}>
                    Pilih tool dari daftar preset atau ketik nama software secara custom di bawah. Semua tool yang terpilih akan tampil pada preview dan kartu portofolio.
                  </p>

                  {/* PREVIEW CONTAINER FOR ALL SELECTED TOOLS (PRESET & CUSTOM) */}
                  <div className="sp-selected-tools-container">
                    <div className="sp-selected-tools-header">
                      <span className="sp-selected-tools-title">
                        Tools Terpilih ({expForm.tools?.length || 0})
                      </span>
                      {expForm.tools && expForm.tools.length > 0 && (
                        <button
                          type="button"
                          className="sp-clear-tools-btn"
                          onClick={() => setExpForm((prev) => ({ ...prev, tools: [] }))}
                          title="Hapus semua tool"
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>

                    {expForm.tools && expForm.tools.length > 0 ? (
                      <div className="sp-selected-tools-list">
                        {expForm.tools.map((tool) => (
                          <div key={tool} className="sp-selected-tool-badge">
                            <span className="sp-selected-tool-logo">{getToolLogo(tool)}</span>
                            <span className="sp-selected-tool-name">{tool}</span>
                            <button
                              type="button"
                              className="sp-remove-tool-pill-btn"
                              onClick={() => handleToggleTool(tool)}
                              title={`Hapus ${tool}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="sp-selected-tools-empty">
                        <span>Belum ada tool yang dipilih. Pilih dari preset di bawah atau ketik tool baru.</span>
                      </div>
                    )}
                  </div>

                  {/* PRESET CHIPS */}
                  <div className="sp-tools-presets">
                    {PRESET_TOOLS.map((tool) => {
                      const isSelected = expForm.tools?.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          className={`sp-tool-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleTool(tool)}
                        >
                          <span className="sp-tool-chip-logo">{getToolLogo(tool)}</span>
                          <span>{tool}</span>
                          {isSelected && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* MANUAL TOOL INPUT */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                    <input
                      type="text"
                      placeholder="Tambah software/tool lain (e.g. Cinema 4D, DaVinci, Blender)..."
                      value={customToolInput}
                      onChange={(e) => setCustomToolInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTool();
                        }
                      }}
                      className="sp-input-field"
                      style={{ maxWidth: '380px' }}
                    />
                    <button
                      type="button"
                      className="sp-btn-add-item"
                      onClick={handleAddCustomTool}
                    >
                      <Plus size={14} />
                      <span>Tambah Tool</span>
                    </button>
                  </div>
                </div>

                {/* SECTION 4: FOTO DOKUMENTASI (PHOTO STACK & LIGHTBOX) */}
                <div className="sp-form-section">
                  <h3 className="sp-section-heading">
                    <Camera size={16} />
                    <span>4. Foto Dokumentasi Kegiatan (Photo Stack & Lightbox)</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--sp-muted)', margin: '0 0 0.5rem 0' }}>
                    Unggah 3+ foto untuk efek tumpukan kartu interaktif dan tampilan modal resolusi tinggi di website.
                  </p>

                  <div
                    className={`sp-upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadDocPhotos}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                    <Upload
                      size={28}
                      className={`sp-dropzone-icon ${isDragging ? 'is-bouncing' : ''}`}
                      color={isDragging ? '#10b981' : 'var(--sp-accent)'}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDragging ? '#10b981' : 'var(--sp-text)' }}>
                      {uploadingImage
                        ? 'Mengunggah foto ke Sanity CDN...'
                        : isDragging
                        ? 'Lepaskan foto di sini sekarang!'
                        : 'Klik untuk memilih atau seret foto dokumentasi ke sini'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sp-muted)' }}>
                      Mendukung PNG, JPG, JPEG, WebP (Otomatis disimpan di Sanity Image Assets)
                    </span>
                  </div>

                  {/* Grid Preview Foto yang Sudah Ada / Terunggah */}
                  {Array.isArray(expForm.images) && expForm.images.length > 0 && (
                    <div className="sp-photos-grid-preview">
                      {expForm.images.map((img, i) => (
                        <div key={i} className="sp-photo-card-thumb">
                          <img src={img.url || img.image?.url} alt={`Dokumentasi ${i + 1}`} />
                          <button
                            type="button"
                            className="sp-photo-card-remove"
                            onClick={() => handleRemoveDocPhoto(i)}
                            title="Hapus foto ini"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="sp-modal-foot">
                <button
                  type="button"
                  className="sp-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="sp-btn-save-submit" disabled={isSaving}>
                  {isSaving ? 'Menyimpan ke Sanity...' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DIALOG: PROYEK
          ==================================================================== */}
      {isModalOpen && activeTab === 'projects' && (
        <div className="sp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h2>{editingItem ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h2>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="sp-modal-form" onSubmit={handleSaveProjSubmit}>
              <div className="sp-modal-scroll-body">
                <div className="sp-form-section">
                  <div className="sp-field">
                    <label className="sp-input-label">Judul Proyek *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Redesign SIMRS RSUD Hasanuddin"
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="sp-input-label">Kategori</label>
                      <select
                        value={projForm.category}
                        onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                        className="sp-select-field"
                      >
                        <option value="ui-ux">UI/UX Design</option>
                        <option value="web">Web Projects</option>
                        <option value="graphic-design">Graphic Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="sp-input-label">Tahun Pembuatan</label>
                      <input
                        type="number"
                        value={projForm.year}
                        onChange={(e) =>
                          setProjForm({ ...projForm, year: parseInt(e.target.value, 10) })
                        }
                        className="sp-input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="sp-input-label">Ringkasan Proyek</label>
                    <textarea
                      rows={3}
                      placeholder="Ringkasan singkat tentang proyek ini..."
                      value={projForm.summary}
                      onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                      className="sp-textarea-field"
                    />
                  </div>
                </div>
              </div>

              <div className="sp-modal-foot">
                <button
                  type="button"
                  className="sp-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="sp-btn-save-submit" disabled={isSaving}>
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
