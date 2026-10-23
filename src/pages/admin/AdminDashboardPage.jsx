import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  ImagePlus,
  Database,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  UploadCloud,
  Check,
  Copy,
  X,
  AlertCircle,
  Lock,
  ShieldCheck,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  supabase,
  isSupabaseConfigured,
  uploadImageToStorage,
  getProjects,
  saveProject,
  deleteProject,
  getExperiences,
  saveExperience,
  deleteExperience,
  STORAGE_BUCKET,
} from '@/lib/supabaseClient';
import './AdminDashboardPage.css';

export function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'experiences' | 'media' | 'sql'
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(getEmptyProjectForm());
  const [projectUploadLoading, setProjectUploadLoading] = useState(false);

  // Experience Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState(getEmptyExpForm());
  const [expUploadLoading, setExpUploadLoading] = useState(false);

  // Media Tab State
  const [uploadedMediaList, setUploadedMediaList] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Check auth session on load
  useEffect(() => {
    async function checkAuth() {
      // Check Supabase session
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setIsAuthenticated(true);
        }
      }
      // Check local developer override
      const devAuth = sessionStorage.getItem('salporto_admin_authed');
      if (devAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
    checkAuth();
  }, []);

  // Fetch data
  const loadData = async () => {
    setLoading(true);
    const [pList, eList] = await Promise.all([getProjects(), getExperiences()]);
    setProjects(pList || []);
    setExperiences(eList || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('salporto_admin_authed', 'true');
          showToast('Login berhasil!');
          return;
        }
      }
      throw new Error('Konfigurasi Supabase Auth belum aktif atau kredensial belum terdaftar.');
    } catch (err) {
      setAuthError(err.message || 'Login gagal');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDevBypass = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('salporto_admin_authed', 'true');
    showToast('Masuk via Akses Pengembang');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('salporto_admin_authed');
    setIsAuthenticated(false);
  };

  // Helper form creators
  function getEmptyProjectForm() {
    return {
      id: `proj-${Date.now()}`,
      slug: '',
      title: '',
      category: 'ui-ux',
      categoryLabel: 'UI/UX Design',
      year: new Date().getFullYear(),
      role: '',
      projectType: 'Client / Case Study',
      summary: '',
      coverImage: '',
      featured: true,
      published: true,
      tags: ['Design', 'Web'],
    };
  }

  function getEmptyExpForm() {
    return {
      id: `exp-${Date.now()}`,
      role: '',
      organization: '',
      period: '2024',
      type: 'Internship',
      isCurrent: false,
      logo: '',
      jobdesk: [''],
      images: [],
    };
  }

  // --- PROJECT ACTIONS ---
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm(getEmptyProjectForm());
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      ...proj,
      tags: Array.isArray(proj.tags) ? proj.tags : [],
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title) return;

    const slug =
      projectForm.slug ||
      projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const toSave = {
      ...projectForm,
      slug,
      year: parseInt(projectForm.year, 10) || new Date().getFullYear(),
    };

    await saveProject(toSave);
    await loadData();
    setIsProjectModalOpen(false);
    showToast('Proyek berhasil disimpan!');
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus proyek "${title}"?`)) {
      await deleteProject(id);
      await loadData();
      showToast('Proyek berhasil dihapus');
    }
  };

  // Cover image upload for projects
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProjectUploadLoading(true);
    const { url, error } = await uploadImageToStorage(file, 'projects');
    if (url) {
      setProjectForm((prev) => ({ ...prev, coverImage: url }));
      showToast('Gambar cover berhasil diunggah ke Supabase Storage!');
    } else {
      alert(`Gagal mengunggah: ${error?.message || 'Periksa koneksi Supabase'}`);
    }
    setProjectUploadLoading(false);
  };

  // --- EXPERIENCE ACTIONS ---
  const openNewExpModal = () => {
    setEditingExp(null);
    setExpForm(getEmptyExpForm());
    setIsExpModalOpen(true);
  };

  const openEditExpModal = (exp) => {
    setEditingExp(exp);
    setExpForm({
      ...exp,
      jobdesk: Array.isArray(exp.jobdesk) && exp.jobdesk.length > 0 ? exp.jobdesk : [''],
      images: Array.isArray(exp.images) ? exp.images : [],
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!expForm.role || !expForm.organization) return;

    const filteredJobdesk = (expForm.jobdesk || []).filter((item) => item.trim() !== '');

    const toSave = {
      ...expForm,
      jobdesk: filteredJobdesk,
    };

    await saveExperience(toSave);
    await loadData();
    setIsExpModalOpen(false);
    showToast('Pengalaman berhasil disimpan!');
  };

  const handleDeleteExperience = async (id, role) => {
    if (window.confirm(`Yakin ingin menghapus pengalaman "${role}"?`)) {
      await deleteExperience(id);
      await loadData();
      showToast('Pengalaman berhasil dihapus');
    }
  };

  // Jobdesk list point operations
  const addJobdeskPoint = () => {
    setExpForm((prev) => ({ ...prev, jobdesk: [...(prev.jobdesk || []), ''] }));
  };

  const updateJobdeskPoint = (idx, val) => {
    setExpForm((prev) => {
      const list = [...(prev.jobdesk || [])];
      list[idx] = val;
      return { ...prev, jobdesk: list };
    });
  };

  const removeJobdeskPoint = (idx) => {
    setExpForm((prev) => {
      const list = (prev.jobdesk || []).filter((_, i) => i !== idx);
      return { ...prev, jobdesk: list.length > 0 ? list : [''] };
    });
  };

  // Upload photo into experience images array
  const handleExpPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setExpUploadLoading(true);
    for (const file of files) {
      const { url } = await uploadImageToStorage(file, 'experiences');
      if (url) {
        setExpForm((prev) => ({
          ...prev,
          images: [
            ...(prev.images || []),
            {
              url,
              title: file.name.replace(/\.[^/.]+$/, ''),
              caption: 'Dokumentasi kegiatan',
            },
          ],
        }));
      }
    }
    setExpUploadLoading(false);
    showToast('Foto dokumentasi berhasil diunggah ke Supabase!');
  };

  // --- MEDIA TAB DIRECT UPLOAD ---
  const handleDirectMediaUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMediaUploading(true);
    const newItems = [];
    for (const file of files) {
      const { url, path, error } = await uploadImageToStorage(file, 'media');
      if (url) {
        newItems.push({
          name: file.name,
          url,
          path,
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadedAt: new Date().toLocaleTimeString(),
        });
      } else {
        alert(`Gagal upload ${file.name}: ${error?.message}`);
      }
    }
    setUploadedMediaList((prev) => [...newItems, ...prev]);
    setMediaUploading(false);
    showToast(`${newItems.length} media berhasil diunggah ke Supabase Storage!`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
    showToast('Tautan berhasil disalin!');
  };

  // LOGIN SCREEN (If not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="admin-login-stage">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <span className="admin-badge">
              <ShieldCheck size={14} />
              <span>SalPorto Studio</span>
            </span>
            <h1 className="admin-login-title font-serif">Admin Dashboard</h1>
            <p className="admin-login-desc">
              Kelola proyek, riwayat pengalaman, dan aset gambar secara dinamis dengan Supabase.
            </p>
          </div>

          <form onSubmit={handleLogin} className="admin-form">
            {authError && (
              <div className="admin-alert admin-alert-danger">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <div className="admin-field">
              <label>Email Admin</label>
              <input
                type="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                autoComplete="email"
              />
            </div>

            <div className="admin-field">
              <label>Kata Sandi</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={authLoading}>
              <Lock size={15} />
              <span>{authLoading ? 'Memproses...' : 'Masuk via Supabase Auth'}</span>
            </button>
          </form>

          <div className="admin-dev-bypass-box">
            <div className="admin-divider">
              <span>Akses Cepat Pengembang</span>
            </div>
            <button
              type="button"
              onClick={handleDevBypass}
              className="admin-btn admin-btn-secondary"
            >
              <Eye size={15} />
              <span>Masuk Tanpa Password (Mode Demo / Dev)</span>
            </button>
            <p className="admin-bypass-hint">
              Fitur ini memungkinkan Anda langsung mengelola dan menguji dashboard secara lokal
              sebelum menambahkan akun di Supabase Auth.
            </p>
          </div>

          <div className="admin-login-footer">
            <Link to="/" className="admin-back-link">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="admin-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADMIN TOP NAV */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin" className="admin-brand">
            <span className="admin-brand-icon">S</span>
            <span className="admin-brand-text">
              SalPorto <em>Admin</em>
            </span>
          </Link>

          <nav className="admin-nav-tabs">
            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={16} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderKanban size={16} />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              <Briefcase size={16} />
              <span>Experience ({experiences.length})</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImagePlus size={16} />
              <span>Media Storage</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'sql' ? 'active' : ''}`}
              onClick={() => setActiveTab('sql')}
            >
              <Database size={16} />
              <span>SQL Setup</span>
            </button>
          </nav>
        </div>

        <div className="admin-topbar-right">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-link-btn"
            title="Lihat Website"
          >
            <Eye size={15} />
            <span>Lihat Website</span>
            <ExternalLink size={12} />
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Keluar dari Admin"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="admin-main-container">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h2 className="admin-pane-title font-serif">Ringkasan Sistem</h2>
                <p className="admin-pane-subtitle">
                  Pantau koneksi Supabase, ringkasan konten proyek, dan status hosting Vercel.
                </p>
              </div>
              <button type="button" onClick={loadData} className="admin-btn admin-btn-outline">
                <RefreshCw size={14} />
                <span>Segarkan Data</span>
              </button>
            </div>

            {/* Metric Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                  <FolderKanban size={20} color="#818CF8" />
                </div>
                <div>
                  <span className="stat-label">Total Proyek</span>
                  <div className="stat-value">{projects.length}</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                  <Briefcase size={20} color="#34D399" />
                </div>
                <div>
                  <span className="stat-label">Total Pengalaman</span>
                  <div className="stat-value">{experiences.length}</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)' }}>
                  <Database size={20} color="#38BDF8" />
                </div>
                <div>
                  <span className="stat-label">Supabase Cloud</span>
                  <div className="stat-status-badge">
                    <span className="stat-dot-live"></span>
                    <span>Terhubung</span>
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                  <UploadCloud size={20} color="#FBBF24" />
                </div>
                <div>
                  <span className="stat-label">Storage Bucket</span>
                  <div className="stat-value" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {STORAGE_BUCKET}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="admin-quick-actions-panel">
              <h3 className="panel-title">Tindakan Cepat</h3>
              <div className="quick-actions-row">
                <button
                  type="button"
                  onClick={openNewProjectModal}
                  className="quick-action-btn"
                >
                  <Plus size={16} />
                  <span>Tambah Proyek Baru</span>
                </button>

                <button
                  type="button"
                  onClick={openNewExpModal}
                  className="quick-action-btn"
                >
                  <Plus size={16} />
                  <span>Tambah Pengalaman Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="quick-action-btn"
                >
                  <ImagePlus size={16} />
                  <span>Unggah Gambar ke Supabase</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sql')}
                  className="quick-action-btn"
                >
                  <Database size={16} />
                  <span>Salin Script SQL Supabase</span>
                </button>
              </div>
            </div>

            {/* Information Card */}
            <div className="admin-info-banner">
              <Sparkles size={20} className="info-banner-icon" />
              <div>
                <h4 className="info-banner-title">Siap Deploy ke Vercel</h4>
                <p className="info-banner-desc">
                  Proyek ini telah dikonfigurasi dengan file <code>vercel.json</code> untuk mendukung
                  routing SPA secara otomatis tanpa error 404 saat melakukan reload halaman. Gambar
                  disimpan langsung di CDN Supabase Storage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h2 className="admin-pane-title font-serif">Manajemen Proyek</h2>
                <p className="admin-pane-subtitle">
                  Tambah, ubah, atau hapus case study portofolio UI/UX, Web, dan Desain Grafis.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewProjectModal}
                className="admin-btn admin-btn-primary"
              >
                <Plus size={16} />
                <span>Tambah Proyek</span>
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Judul &amp; Slug</th>
                    <th>Kategori</th>
                    <th>Tahun</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.id}>
                      <td style={{ width: '80px' }}>
                        <div className="admin-table-thumb">
                          {proj.coverImage ? (
                            <img src={proj.coverImage} alt={proj.title} />
                          ) : (
                            <div className="thumb-placeholder">No Cover</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table-item-title">{proj.title}</div>
                        <div className="table-item-sub">/{proj.slug}</div>
                      </td>
                      <td>
                        <span className="admin-pill-tag">
                          {proj.categoryLabel || proj.category}
                        </span>
                      </td>
                      <td>{proj.year}</td>
                      <td>
                        <span
                          className={`admin-status-pill ${proj.published !== false ? 'live' : 'draft'}`}
                        >
                          {proj.published !== false ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(proj)}
                            className="table-action-icon"
                            title="Edit Proyek"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="table-action-icon delete"
                            title="Hapus Proyek"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                        Belum ada data proyek. Klik tombol "Tambah Proyek" di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: EXPERIENCES ================= */}
        {activeTab === 'experiences' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h2 className="admin-pane-title font-serif">Manajemen Pengalaman</h2>
                <p className="admin-pane-subtitle">
                  Atur riwayat jabatan, instansi, jangka waktu bulan, jobdesk, dan tumpukan 3 foto
                  dokumentasi.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewExpModal}
                className="admin-btn admin-btn-primary"
              >
                <Plus size={16} />
                <span>Tambah Pengalaman</span>
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Jabatan</th>
                    <th>Instansi</th>
                    <th>Periode Bulan</th>
                    <th>Tipe</th>
                    <th>Foto</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => (
                    <tr key={exp.id}>
                      <td>
                        <div className="table-item-title">{exp.role}</div>
                        {exp.isCurrent && (
                          <span className="admin-status-pill live">Aktif / Current</span>
                        )}
                      </td>
                      <td>
                        <div className="table-item-org">{exp.organization}</div>
                      </td>
                      <td>{exp.period}</td>
                      <td>
                        <span className="admin-pill-tag">{exp.type}</span>
                      </td>
                      <td>
                        <span className="table-item-count">
                          {exp.images?.length || 0} Foto
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            onClick={() => openEditExpModal(exp)}
                            className="table-action-icon"
                            title="Edit Pengalaman"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(exp.id, exp.role)}
                            className="table-action-icon delete"
                            title="Hapus Pengalaman"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {experiences.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                        Belum ada data pengalaman. Klik tombol "Tambah Pengalaman" di atas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MEDIA STORAGE ================= */}
        {activeTab === 'media' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h2 className="admin-pane-title font-serif">Supabase Media Storage</h2>
                <p className="admin-pane-subtitle">
                  Unggah file gambar ke bucket <code>{STORAGE_BUCKET}</code> dan dapatkan tautan URL
                  publik secara instan.
                </p>
              </div>
            </div>

            {/* Dropzone */}
            <div className="admin-dropzone-box">
              <UploadCloud size={36} className="dropzone-icon" />
              <h4 className="dropzone-title">Pilih atau Seret Gambar ke Sini</h4>
              <p className="dropzone-desc">Mendukung format PNG, JPG, WebP, dan SVG</p>

              <label className="admin-btn admin-btn-primary dropzone-file-btn">
                <span>{mediaUploading ? 'Mengunggah ke Supabase...' : 'Pilih File Gambar'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleDirectMediaUpload}
                  disabled={mediaUploading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Uploaded Items List */}
            {uploadedMediaList.length > 0 && (
              <div className="admin-media-results-section">
                <h3 className="section-label">Media yang Baru Diunggah:</h3>
                <div className="admin-media-grid">
                  {uploadedMediaList.map((item, idx) => (
                    <div key={idx} className="admin-media-card">
                      <div className="media-preview-box">
                        <img src={item.url} alt={item.name} />
                      </div>
                      <div className="media-info-box">
                        <div className="media-name">{item.name}</div>
                        <div className="media-size">{item.size}</div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.url)}
                          className="admin-btn admin-btn-outline media-copy-btn"
                        >
                          {copiedUrl === item.url ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedUrl === item.url ? 'Tersalin!' : 'Salin URL'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: SQL SETUP ================= */}
        {activeTab === 'sql' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h2 className="admin-pane-title font-serif">Setup Database Supabase</h2>
                <p className="admin-pane-subtitle">
                  Jalankan script SQL ini di <strong>Supabase Dashboard &gt; SQL Editor</strong> untuk
                  membuat tabel <code>projects</code>, <code>experiences</code>, dan storage bucket
                  secara otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const sql = `-- ==============================================================================
-- SALPORTO SUPABASE DATABASE & STORAGE SETUP SCRIPT (FULL FIX)
-- ==============================================================================

-- 1. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  year INTEGER,
  role TEXT,
  project_type TEXT,
  summary TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. CREATE EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  period TEXT NOT NULL,
  type TEXT DEFAULT 'Internship',
  is_current BOOLEAN DEFAULT false,
  logo TEXT,
  jobdesk JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PROJECTS & EXPERIENCES
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
DROP POLICY IF EXISTS "Allow All Projects" ON public.projects;

DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin All Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow All Experiences" ON public.experiences;

CREATE POLICY "Allow All Projects" ON public.projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow All Experiences" ON public.experiences
  FOR ALL USING (true) WITH CHECK (true);

-- 5. STORAGE BUCKET CREATION FOR PORTFOLIO IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop old storage policies if any
DROP POLICY IF EXISTS "Public Access Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Storage" ON storage.objects;
DROP POLICY IF EXISTS "Storage Select Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Insert Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Update Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Delete Policy" ON storage.objects;

-- Create storage policies allowing read, upload, update, and delete on 'portfolio-images' bucket
CREATE POLICY "Storage Select Policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Insert Policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Update Policy" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Delete Policy" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-images');`;
                  copyToClipboard(sql);
                }}
                className="admin-btn admin-btn-primary"
              >
                <Copy size={15} />
                <span>Salin Script SQL Lengkap</span>
              </button>
            </div>

            <div className="admin-sql-viewer">
              <div className="sql-instruction-step">
                <span className="step-num">1</span>
                <span>Buka Dashboard Supabase: <strong>https://supabase.com/dashboard/project/qarvsujzxunsyktofquu</strong></span>
              </div>
              <div className="sql-instruction-step">
                <span className="step-num">2</span>
                <span>Buka menu <strong>SQL Editor</strong> di bilah navigasi kiri.</span>
              </div>
              <div className="sql-instruction-step">
                <span className="step-num">3</span>
                <span>Klik <strong>New Query</strong>, paste script SQL, lalu klik tombol <strong>Run</strong>.</span>
              </div>

              <div className="sql-code-box">
                <pre>
{`-- Solusi Cepat Row-Level Security (RLS) Supabase Storage:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Admin Upload Storage" ON storage.objects;
DROP POLICY IF EXISTS "Storage Insert Policy" ON storage.objects;

CREATE POLICY "Storage Insert Policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Select Policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: EDIT / CREATE PROJECT ================= */}
      {isProjectModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProjectModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="modal-title font-serif">
                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsProjectModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="admin-modal-form">
              <div className="form-grid-2">
                <div className="admin-field">
                  <label>Judul Proyek *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="admin-input"
                    placeholder="Contoh: PerdosFit"
                  />
                </div>

                <div className="admin-field">
                  <label>Slug URL</label>
                  <input
                    type="text"
                    value={projectForm.slug}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, slug: e.target.value })
                    }
                    className="admin-input"
                    placeholder="perdosfit (otomatis jika dikosongkan)"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="admin-field">
                  <label>Kategori</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value,
                        categoryLabel:
                          e.target.value === 'ui-ux'
                            ? 'UI/UX Design'
                            : e.target.value === 'web'
                            ? 'Web / Front-End'
                            : 'Graphic Design',
                      })
                    }
                    className="admin-input"
                  >
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="web">Web Development</option>
                    <option value="graphic-design">Graphic Design</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>Tahun</label>
                  <input
                    type="number"
                    value={projectForm.year}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, year: e.target.value })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="admin-field">
                  <label>Peran / Role</label>
                  <input
                    type="text"
                    value={projectForm.role}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, role: e.target.value })
                    }
                    className="admin-input"
                    placeholder="UI/UX Designer"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Tipe Proyek / Instansi</label>
                <input
                  type="text"
                  value={projectForm.projectType}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, projectType: e.target.value })
                  }
                  className="admin-input"
                  placeholder="Academic / Diskominfo Makassar / KKN-T"
                />
              </div>

              <div className="admin-field">
                <label>Ringkasan Proyek (Summary) *</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.summary}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, summary: e.target.value })
                  }
                  className="admin-input"
                  placeholder="Jelaskan secara singkat tujuan dan solusi proyek..."
                />
              </div>

              {/* Cover Image Upload directly to Supabase */}
              <div className="admin-field">
                <label>Cover Image (Unggah ke Supabase Storage)</label>
                <div className="upload-control-row">
                  <input
                    type="text"
                    value={projectForm.coverImage}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, coverImage: e.target.value })
                    }
                    className="admin-input"
                    placeholder="URL gambar atau unggah file..."
                  />
                  <label className="admin-btn admin-btn-outline upload-btn-label">
                    <span>{projectUploadLoading ? 'Mengunggah...' : 'Pilih File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={projectUploadLoading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {projectForm.coverImage && (
                  <div className="form-image-preview">
                    <img src={projectForm.coverImage} alt="Cover Preview" />
                  </div>
                )}
              </div>

              <div className="form-checkbox-row">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, featured: e.target.checked })
                    }
                  />
                  <span>Tampilkan di Beranda (Featured)</span>
                </label>

                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={projectForm.published !== false}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, published: e.target.checked })
                    }
                  />
                  <span>Publikasikan (Published)</span>
                </label>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT / CREATE EXPERIENCE ================= */}
      {isExpModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsExpModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="modal-title font-serif">
                {editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsExpModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="admin-modal-form">
              <div className="form-grid-2">
                <div className="admin-field">
                  <label>Nama Jabatan *</label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="admin-input"
                    placeholder="Contoh: Laboratory Assistant"
                  />
                </div>

                <div className="admin-field">
                  <label>Nama Instansi / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={expForm.organization}
                    onChange={(e) =>
                      setExpForm({ ...expForm, organization: e.target.value })
                    }
                    className="admin-input"
                    placeholder="Universitas Hasanuddin / Diskominfo"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="admin-field">
                  <label>Jangka Waktu Bulan *</label>
                  <input
                    type="text"
                    required
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    className="admin-input"
                    placeholder="Agustus 2023 — Sekarang"
                  />
                </div>

                <div className="admin-field">
                  <label>Tipe</label>
                  <select
                    value={expForm.type}
                    onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                    className="admin-input"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Internship">Internship</option>
                    <option value="Community / Project">Community / Project</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>

                <div className="admin-field" style={{ justifyContent: 'center' }}>
                  <label className="admin-checkbox-label" style={{ marginTop: '1.75rem' }}>
                    <input
                      type="checkbox"
                      checked={expForm.isCurrent}
                      onChange={(e) =>
                        setExpForm({ ...expForm, isCurrent: e.target.checked })
                      }
                    />
                    <span>Peran Aktif (Current)</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Jobdesk Points */}
              <div className="admin-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>List Tanggung Jawab &amp; Jobdesk (Point-by-point)</label>
                  <button
                    type="button"
                    onClick={addJobdeskPoint}
                    className="admin-btn admin-btn-outline"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Plus size={12} />
                    <span>Tambah Point</span>
                  </button>
                </div>

                <div className="jobdesk-inputs-list">
                  {(expForm.jobdesk || ['']).map((item, idx) => (
                    <div key={idx} className="jobdesk-input-row">
                      <span className="point-index">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateJobdeskPoint(idx, e.target.value)}
                        className="admin-input"
                        placeholder="Contoh: Membimbing praktikum web programming..."
                      />
                      <button
                        type="button"
                        onClick={() => removeJobdeskPoint(idx)}
                        className="point-remove-btn"
                        title="Hapus point"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos upload for 3 stacked images */}
              <div className="admin-field">
                <label>Dokumentasi Foto Pengalaman (Untuk Tumpukan 3 Foto)</label>
                <div className="upload-control-row">
                  <label className="admin-btn admin-btn-outline upload-btn-label">
                    <span>
                      {expUploadLoading ? 'Mengunggah ke Supabase...' : '+ Unggah Foto Dokumentasi'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleExpPhotoUpload}
                      disabled={expUploadLoading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Thumbnails of current images */}
                {expForm.images && expForm.images.length > 0 && (
                  <div className="form-image-preview-grid">
                    {expForm.images.map((img, i) => (
                      <div key={i} className="preview-thumb-box">
                        <img src={img.url} alt={img.title || `Foto ${i + 1}`} />
                        <button
                          type="button"
                          onClick={() => {
                            setExpForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== i),
                            }));
                          }}
                          className="preview-remove-icon"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Simpan Pengalaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
