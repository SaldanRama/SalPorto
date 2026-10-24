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
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  Wrench,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getToolLogo } from '@/components/experience/ExperienceTools';
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

// Popular Tools List for 1-Click Selection
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
  'PHP',
  'Laravel',
  'Notion',
  'Microsoft Excel',
];

export function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('experiences'); // Default focus on experiences
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter state
  const [expSearch, setExpSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');

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
  const [isExpDragOver, setIsExpDragOver] = useState(false);
  const [customToolInput, setCustomToolInput] = useState('');

  // Experience Quick Reorder Modal State
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderList, setReorderList] = useState([]);
  const [reorderSaving, setReorderSaving] = useState(false);
  const [draggedExpIndex, setDraggedExpIndex] = useState(null);

  // Media Tab State
  const [uploadedMediaList, setUploadedMediaList] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Check auth session on load
  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsAuthenticated(true);
          }
        } catch (_) {}
      }
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
    const sortedExp = (eList || []).sort(
      (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
    );
    setExperiences(sortedExp);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
      throw new Error('Kredensial belum terdaftar di Supabase Auth.');
    } catch (err) {
      setAuthError(err.message || 'Login gagal. Periksa email & password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDevBypass = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('salporto_admin_authed', 'true');
    showToast('Masuk via Mode Pengembang (Bypass)');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
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
      period: 'Agustus 2024 — Sekarang',
      type: 'Internship',
      isCurrent: false,
      sortOrder: 0, // 0 = Posisi #1 di Timeline Beranda
      logo: '',
      jobdesk: [''],
      tools: ['VS Code', 'Figma'],
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
    if (!projectForm.title) {
      alert('Mohon isi Judul Proyek.');
      return;
    }

    const slug =
      projectForm.slug ||
      projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const toSave = {
      ...projectForm,
      slug,
      year: parseInt(projectForm.year, 10) || new Date().getFullYear(),
    };

    const res = await saveProject(toSave);
    if (res?.error) {
      alert(`Gagal menyimpan proyek ke database: ${res.error.message || JSON.stringify(res.error)}`);
      return;
    }

    await loadData();
    setIsProjectModalOpen(false);
    showToast('Proyek berhasil disimpan ke website!');
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
      showToast('Cover gambar berhasil diunggah ke Supabase Storage!');
    } else {
      alert(`Gagal mengunggah gambar: ${error?.message || 'Periksa koneksi Supabase'}`);
    }
    setProjectUploadLoading(false);
  };

  // --- EXPERIENCE ACTIONS ---
  const openNewExpModal = () => {
    setEditingExp(null);
    setExpForm(getEmptyExpForm());
    setCustomToolInput('');
    setIsExpModalOpen(true);
  };

  const openEditExpModal = (exp) => {
    setEditingExp(exp);
    setExpForm({
      ...exp,
      isCurrent: exp.is_current !== undefined ? exp.is_current : (exp.isCurrent ?? false),
      sortOrder: exp.sort_order !== undefined ? exp.sort_order : (exp.sortOrder ?? 0),
      logo: exp.logo || '',
      jobdesk: Array.isArray(exp.jobdesk) && exp.jobdesk.length > 0 ? exp.jobdesk : [''],
      tools: Array.isArray(exp.tools) ? exp.tools : [],
      images: Array.isArray(exp.images) ? exp.images : [],
    });
    setCustomToolInput('');
    setIsExpModalOpen(true);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!expForm.role || !expForm.organization) {
      alert('Mohon isi Nama Jabatan dan Nama Instansi / Perusahaan.');
      return;
    }

    const filteredJobdesk = (expForm.jobdesk || []).filter((item) => item && item.trim() !== '');

    const toSave = {
      ...expForm,
      jobdesk: filteredJobdesk,
      tools: Array.isArray(expForm.tools) ? expForm.tools : [],
      sort_order: parseInt(expForm.sortOrder ?? expForm.sort_order ?? 0, 10),
      is_current: expForm.isCurrent ?? expForm.is_current ?? false,
      logo: expForm.logo || '',
    };

    const res = await saveExperience(toSave);
    if (res?.error) {
      alert(`Gagal menyimpan pengalaman: ${res.error.message || JSON.stringify(res.error)}`);
      return;
    }

    await loadData();
    setIsExpModalOpen(false);
    showToast('Pengalaman baru berhasil disimpan ke website!');
  };

  const handleDeleteExperience = async (id, role) => {
    if (window.confirm(`Yakin ingin menghapus pengalaman "${role}"?`)) {
      await deleteExperience(id);
      await loadData();
      showToast('Pengalaman berhasil dihapus');
    }
  };

  // Reorder single experience up / down by 1 position directly from card
  const handleMoveExperience = async (currentIndex, direction) => {
    const sorted = [...experiences].sort(
      (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
    );

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const newSorted = [...sorted];
    const [movedItem] = newSorted.splice(currentIndex, 1);
    newSorted.splice(targetIndex, 0, movedItem);

    // Normalize sort_order sequentially
    const updated = newSorted.map((item, idx) => ({
      ...item,
      sort_order: idx,
      sortOrder: idx,
    }));

    setExperiences(updated);
    showToast(`Urutan "${movedItem.role}" dipindahkan ke posisi #${targetIndex + 1}!`);

    // Persist to Supabase & localStorage
    try {
      await Promise.all(
        updated.map((item) =>
          saveExperience({
            ...item,
            sort_order: item.sort_order,
            sortOrder: item.sort_order,
          })
        )
      );
    } catch (err) {
      console.error('Gagal menyimpan urutan baru:', err);
    }
  };

  // Quick Reorder Modal Handlers
  const openReorderModal = () => {
    const sorted = [...experiences].sort(
      (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
    );
    setReorderList(sorted);
    setIsReorderModalOpen(true);
  };

  const moveReorderItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= reorderList.length) return;
    const updated = [...reorderList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setReorderList(updated);
  };

  const handleDragStart = (e, index) => {
    setDraggedExpIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDropItem = (e, targetIndex) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === targetIndex) return;
    moveReorderItem(draggedExpIndex, targetIndex);
    setDraggedExpIndex(null);
  };

  const saveReorderList = async () => {
    setReorderSaving(true);
    const updated = reorderList.map((item, idx) => ({
      ...item,
      sort_order: idx,
      sortOrder: idx,
    }));

    setExperiences(updated);

    try {
      await Promise.all(
        updated.map((item) =>
          saveExperience({
            ...item,
            sort_order: item.sort_order,
            sortOrder: item.sort_order,
          })
        )
      );
      showToast('Susunan urutan semua pengalaman berhasil disimpan!');
      setIsReorderModalOpen(false);
    } catch (err) {
      alert('Gagal menyimpan susunan ke database: ' + (err.message || 'Error'));
    } finally {
      setReorderSaving(false);
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

  // Tools toggle and custom tools
  const toggleTool = (toolName) => {
    setExpForm((prev) => {
      const current = prev.tools || [];
      if (current.includes(toolName)) {
        return { ...prev, tools: current.filter((t) => t !== toolName) };
      } else {
        return { ...prev, tools: [...current, toolName] };
      }
    });
  };

  const addCustomTool = (e) => {
    if (e) e.preventDefault();
    if (!customToolInput.trim()) return;
    const name = customToolInput.trim();
    if (!expForm.tools?.includes(name)) {
      setExpForm((prev) => ({ ...prev, tools: [...(prev.tools || []), name] }));
    }
    setCustomToolInput('');
  };

  // Upload photo into experience images array (supports file input & drag and drop)
  const processExpPhotoFiles = async (fileList) => {
    const rawFiles = Array.from(fileList || []);
    const imageFiles = rawFiles.filter(
      (f) => (f.type && f.type.startsWith('image/')) || /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(f.name)
    );

    if (imageFiles.length === 0) {
      if (rawFiles.length > 0) {
        alert('Mohon pilih atau drop file gambar yang valid (PNG, JPG, WebP, dll).');
      }
      return;
    }

    setExpUploadLoading(true);
    let successCount = 0;
    const newImages = [];

    for (const file of imageFiles) {
      const { url, error } = await uploadImageToStorage(file, 'experiences');
      if (url) {
        successCount++;
        newImages.push({
          url,
          title: '',
          caption: '',
        });
      } else {
        alert(`Gagal upload ${file.name}: ${error?.message || 'Periksa koneksi Supabase Storage'}`);
      }
    }

    if (newImages.length > 0) {
      setExpForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
      showToast(`${successCount} foto dokumentasi berhasil diunggah ke Supabase!`);
    }

    setExpUploadLoading(false);
  };

  const handleExpPhotoUpload = (e) => {
    if (e.target.files) {
      processExpPhotoFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleExpDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processExpPhotoFiles(e.dataTransfer.files);
    }
  };

  const handleExpDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isExpDragOver) setIsExpDragOver(true);
  };

  const handleExpDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsExpDragOver(false);
  };

  // --- MEDIA TAB DIRECT UPLOAD ---
  const handleDirectMediaUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMediaUploading(true);
    const newItems = [];
    for (const file of files) {
      const { url, error } = await uploadImageToStorage(file, 'uploads');
      if (url) {
        newItems.push({
          url,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
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

  // Filtered lists for search (always strictly sorted by sort_order)
  const sortedExperiences = [...experiences].sort(
    (a, b) => (a.sort_order ?? a.sortOrder ?? 0) - (b.sort_order ?? b.sortOrder ?? 0)
  );

  const filteredExperiences = sortedExperiences.filter((e) => {
    const term = expSearch.toLowerCase();
    return (
      (e.role && e.role.toLowerCase().includes(term)) ||
      (e.organization && e.organization.toLowerCase().includes(term)) ||
      (e.type && e.type.toLowerCase().includes(term))
    );
  });

  const filteredProjects = projects.filter((p) => {
    const term = projSearch.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.role && p.role.toLowerCase().includes(term))
    );
  });

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-stage">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <span className="admin-badge">
              <ShieldCheck size={14} />
              <span>SalPorto Studio Admin</span>
            </span>
            <h1 className="admin-login-title">Admin Dashboard</h1>
            <p className="admin-login-desc">
              Kelola proyek, riwayat pengalaman, dan aset gambar secara dinamis dengan font Poppins &amp; Supabase.
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
              Fitur ini memungkinkan Anda langsung mengelola dan menguji website secara lokal.
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

  // =========================================================================
  // AUTHENTICATED DASHBOARD
  // =========================================================================
  return (
    <div className="admin-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin" className="admin-brand">
            <div className="admin-brand-icon">S</div>
            <div className="admin-brand-text">
              <strong>SalPorto</strong> Admin
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="admin-nav-tabs">
            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              <Briefcase size={16} />
              <span>Kelola Pengalaman</span>
              <span className="tab-badge">{experiences.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderKanban size={16} />
              <span>Kelola Proyek</span>
              <span className="tab-badge">{projects.length}</span>
            </button>

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
            title="Buka Website di Tab Baru"
          >
            <ExternalLink size={14} />
            <span>Lihat Website</span>
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Keluar dari Dashboard"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="admin-main-container">
        {/* ================= TAB 1: KELOLA PENGALAMAN ================= */}
        {activeTab === 'experiences' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h1 className="admin-pane-title">Manajemen Pengalaman (Career Timeline)</h1>
                <p className="admin-pane-subtitle">
                  Atur riwayat jabatan, instansi, jangka waktu, jobdesk, tools yang digunakan, dan foto dokumentasi di timeline.
                </p>
              </div>
              <div className="admin-header-actions-group">
                <button
                  type="button"
                  onClick={openReorderModal}
                  className="admin-btn admin-btn-secondary admin-btn-lg"
                  title="Atur susunan urutan semua pengalaman secara fleksibel"
                >
                  <ArrowUpDown size={17} />
                  <span>Atur Urutan ({experiences.length})</span>
                </button>
                <button
                  type="button"
                  onClick={openNewExpModal}
                  className="admin-btn admin-btn-primary admin-btn-lg"
                >
                  <Plus size={18} />
                  <span>Tambah Pengalaman Baru</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-filter-bar">
              <div className="admin-search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan jabatan atau instansi..."
                  value={expSearch}
                  onChange={(e) => setExpSearch(e.target.value)}
                  className="admin-search-input"
                />
                {expSearch && (
                  <button onClick={() => setExpSearch('')} className="search-clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="admin-filter-meta">
                Menampilkan <strong>{filteredExperiences.length}</strong> pengalaman (diurutkan dari posisi #1)
              </div>
            </div>

            {/* Experience Cards Grid */}
            <div className="admin-exp-grid">
              {filteredExperiences.map((exp, idx) => (
                <div key={exp.id || idx} className="admin-exp-card">
                  <div className="exp-card-header">
                    <div className="exp-card-main">
                      <div className="exp-badges-row">
                        <span className="admin-tag-pill">{exp.type || 'Experience'}</span>
                        {exp.isCurrent && (
                          <span className="admin-status-pill live">Sedang Aktif (Current)</span>
                        )}
                        {idx < 3 ? (
                          <span className="admin-order-badge top-badge" title="Tampil di Timeline Beranda (Top 3)">
                            ⭐ Beranda #{idx + 1}
                          </span>
                        ) : (
                          <span className="admin-order-badge" title="Tampil di halaman /experience">
                            Urutan #{idx + 1}
                          </span>
                        )}
                      </div>
                      <h3 className="exp-card-role">{exp.role}</h3>
                      <div className="exp-card-org">
                        <Building2 size={15} />
                        <span>{exp.organization}</span>
                        {(() => {
                          const logos = Array.isArray(exp.logo)
                            ? exp.logo
                            : (typeof exp.logo === 'string' && exp.logo.startsWith('[')
                                ? JSON.parse(exp.logo)
                                : [exp.logo].filter(Boolean));
                          return logos.length > 0 ? (
                            <div className="card-org-logos-wrap">
                              {logos.map((l, lIdx) => (
                                <span key={lIdx} className="card-org-logo-pill" title="Logo Terpasang">
                                  <img src={l} alt="Logo" />
                                </span>
                              ))}
                            </div>
                          ) : null;
                        })()}
                      </div>
                      <div className="exp-card-period">
                        <Calendar size={14} />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <div className="exp-card-actions">
                      {/* 1-Click Move Up / Down Buttons */}
                      <div className="exp-reorder-quick-group" title="Ubah urutan langsung">
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(idx, 'up')}
                          disabled={idx === 0}
                          className="admin-icon-btn reorder-btn"
                          title={idx === 0 ? 'Sudah berada di posisi teratas' : 'Pindahkan ke Atas (▲)'}
                          aria-label="Pindahkan ke Atas"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(idx, 'down')}
                          disabled={idx === filteredExperiences.length - 1}
                          className="admin-icon-btn reorder-btn"
                          title={
                            idx === filteredExperiences.length - 1
                              ? 'Sudah berada di posisi terbawah'
                              : 'Pindahkan ke Bawah (▼)'
                          }
                          aria-label="Pindahkan ke Bawah"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditExpModal(exp)}
                        className="admin-icon-btn edit"
                        title="Edit Pengalaman"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id, exp.role)}
                        className="admin-icon-btn delete"
                        title="Hapus Pengalaman"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Jobdesk summary */}
                  {exp.jobdesk && exp.jobdesk.length > 0 && (
                    <div className="exp-card-jobdesk">
                      <div className="jobdesk-title">Tanggung Jawab ({exp.jobdesk.length} Poin):</div>
                      <ul className="jobdesk-list-preview">
                        {exp.jobdesk.slice(0, 2).map((jd, jIdx) => (
                          <li key={jIdx}>{jd}</li>
                        ))}
                        {exp.jobdesk.length > 2 && (
                          <li className="more-points">+{exp.jobdesk.length - 2} poin tanggung jawab lainnya</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Tools preview */}
                  {exp.tools && exp.tools.length > 0 && (
                    <div className="exp-card-tools-row">
                      <span className="card-tools-label">Tools:</span>
                      <div className="card-tools-chips">
                        {exp.tools.map((t, tIdx) => (
                          <span key={tIdx} className="card-tool-tag">
                            <span className="tag-icon">{getToolLogo(t)}</span>
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos preview strip */}
                  <div className="exp-card-photos-strip">
                    <div className="photos-strip-title">
                      Foto Dokumentasi ({exp.images?.length || 0} Foto):
                    </div>
                    {exp.images && exp.images.length > 0 ? (
                      <div className="photos-strip-thumbnails">
                        {exp.images.map((img, i) => (
                          <div key={i} className="photo-thumb-item">
                            <img src={img.url} alt={`Dokumentasi ${i + 1}`} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-photos-hint">Belum ada foto dokumentasi diunggah</div>
                    )}
                  </div>
                </div>
              ))}

              {filteredExperiences.length === 0 && (
                <div className="admin-empty-state">
                  <Briefcase size={40} className="empty-icon" />
                  <h3>Belum Ada Pengalaman Ditemukan</h3>
                  <p>Klik tombol "+ Tambah Pengalaman Baru" di atas untuk menambahkan pengalaman pertama Anda.</p>
                  <button onClick={openNewExpModal} className="admin-btn admin-btn-primary">
                    <Plus size={16} />
                    <span>Tambah Pengalaman Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: KELOLA PROYEK ================= */}
        {activeTab === 'projects' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h1 className="admin-pane-title">Manajemen Proyek &amp; Studi Kasus</h1>
                <p className="admin-pane-subtitle">
                  Kelola proyek desain UI/UX, proyek web, dan desain grafis yang tampil di beranda dan halaman /work.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewProjectModal}
                className="admin-btn admin-btn-primary admin-btn-lg"
              >
                <Plus size={18} />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-filter-bar">
              <div className="admin-search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau kategori..."
                  value={projSearch}
                  onChange={(e) => setProjSearch(e.target.value)}
                  className="admin-search-input"
                />
                {projSearch && (
                  <button onClick={() => setProjSearch('')} className="search-clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="admin-filter-meta">
                Menampilkan <strong>{filteredProjects.length}</strong> proyek
              </div>
            </div>

            {/* Projects Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Judul &amp; Slug</th>
                    <th>Kategori</th>
                    <th>Tahun</th>
                    <th>Peran</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => {
                    const cover = proj.coverImage || proj.cover_image;
                    return (
                      <tr key={proj.id}>
                        <td style={{ width: '80px' }}>
                          <div className="table-cover-box">
                            {cover ? (
                              <img src={cover} alt={proj.title} />
                            ) : (
                              <div className="table-cover-placeholder">
                                <Sparkles size={16} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="table-item-title">{proj.title}</div>
                          <div className="table-item-sub">/{proj.slug}</div>
                        </td>
                        <td>
                          <span className="admin-tag-pill">{proj.categoryLabel || proj.category}</span>
                        </td>
                        <td>{proj.year}</td>
                        <td>{proj.role || '—'}</td>
                        <td>
                          {proj.published !== false ? (
                            <span className="admin-status-pill live">Published</span>
                          ) : (
                            <span className="admin-status-pill draft">Draft</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-cell">
                            <button
                              type="button"
                              onClick={() => openEditProjectModal(proj)}
                              className="admin-icon-btn edit"
                              title="Edit Proyek"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="admin-icon-btn delete"
                              title="Hapus Proyek"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                        Tidak ada data proyek yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h1 className="admin-pane-title">Ringkasan Sistem Portofolio</h1>
                <p className="admin-pane-subtitle">
                  Status database, ringkasan konten, dan akses cepat pengelolaan website Anda.
                </p>
              </div>
              <button type="button" onClick={loadData} className="admin-btn admin-btn-outline">
                <RefreshCw size={15} />
                <span>Perbarui Data</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <div className="metric-icon-box blue">
                  <Briefcase size={22} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Total Pengalaman</div>
                  <div className="metric-value">{experiences.length}</div>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="metric-icon-box purple">
                  <FolderKanban size={22} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Total Proyek</div>
                  <div className="metric-value">{projects.length}</div>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="metric-icon-box green">
                  <Database size={22} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Database Supabase</div>
                  <div className="metric-value" style={{ fontSize: '1rem', color: '#10b981' }}>
                    {isSupabaseConfigured() ? 'Terhubung (Online)' : 'Mode Fallback'}
                  </div>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="metric-icon-box orange">
                  <Layers size={22} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Hosting Ready</div>
                  <div className="metric-value" style={{ fontSize: '1rem' }}>
                    Vercel SPA Configured
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="admin-quick-actions-card">
              <h3>Aksi Cepat</h3>
              <div className="quick-actions-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('experiences');
                    openNewExpModal();
                  }}
                  className="admin-btn admin-btn-primary"
                >
                  <Plus size={16} />
                  <span>Tambah Pengalaman Baru</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('projects');
                    openNewProjectModal();
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  <Plus size={16} />
                  <span>Tambah Proyek Baru</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="admin-btn admin-btn-outline"
                >
                  <UploadCloud size={16} />
                  <span>Unggah Gambar ke Storage</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MEDIA STORAGE ================= */}
        {activeTab === 'media' && (
          <div className="admin-tab-pane">
            <div className="admin-pane-header">
              <div>
                <h1 className="admin-pane-title">Supabase Media Storage</h1>
                <p className="admin-pane-subtitle">
                  Unggah file gambar ke bucket <code>{STORAGE_BUCKET}</code> dan dapatkan tautan URL CDN publik secara instan.
                </p>
              </div>
            </div>

            <div className="admin-dropzone-box">
              <UploadCloud size={40} className="dropzone-icon" />
              <h3 className="dropzone-title">Pilih atau Seret Gambar ke Sini</h3>
              <p className="dropzone-desc">Mendukung format PNG, JPG, WebP, dan SVG langsung ke Supabase</p>

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
                <h1 className="admin-pane-title">Setup Database Supabase</h1>
                <p className="admin-pane-subtitle">
                  Script SQL lengkap untuk tabel <code>projects</code>, <code>experiences</code> (termasuk kolom <code>tools</code>), serta konfigurasi RLS Storage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const sql = `-- SalPorto Migration: Menambahkan kolom tools jika belum ada\nALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]'::jsonb;\n\n-- Update data tools bawaan jika kolom baru ditambahkan\nUPDATE public.experiences \nSET tools = '["VS Code", "React", "JavaScript", "PHP", "Laravel"]'::jsonb \nWHERE id = 'lab-assistant' AND (tools IS NULL OR jsonb_array_length(tools) = 0);\n\nUPDATE public.experiences \nSET tools = '["Figma", "VS Code", "JavaScript", "CSS3"]'::jsonb \nWHERE id = 'diskominfo' AND (tools IS NULL OR jsonb_array_length(tools) = 0);\n\nUPDATE public.experiences \nSET tools = '["Notion", "Microsoft Excel", "Data Analytics"]'::jsonb \nWHERE id = 'bpjs-kesehatan' AND (tools IS NULL OR jsonb_array_length(tools) = 0);`;
                  copyToClipboard(sql);
                }}
                className="admin-btn admin-btn-primary"
              >
                <Copy size={15} />
                <span>Salin Script SQL Migration Tools</span>
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
                <span>Paste script migration di bawah dan klik tombol <strong>Run</strong>:</span>
              </div>
              <pre style={{ margin: '1rem 0 0', padding: '1rem', background: '#0a0d14', border: '1px solid var(--line)', borderRadius: '0.65rem', overflowX: 'auto', fontSize: '0.8rem', color: '#10b981', fontFamily: 'monospace' }}>
{`ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]'::jsonb;

UPDATE public.experiences 
SET tools = '["VS Code", "React", "JavaScript", "PHP", "Laravel"]'::jsonb 
WHERE id = 'lab-assistant' AND (tools IS NULL OR jsonb_array_length(tools) = 0);

UPDATE public.experiences 
SET tools = '["Figma", "VS Code", "JavaScript", "CSS3"]'::jsonb 
WHERE id = 'diskominfo' AND (tools IS NULL OR jsonb_array_length(tools) = 0);

UPDATE public.experiences 
SET tools = '["Notion", "Microsoft Excel", "Data Analytics"]'::jsonb 
WHERE id = 'bpjs-kesehatan' AND (tools IS NULL OR jsonb_array_length(tools) = 0);`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: EDIT / CREATE EXPERIENCE (CLEAN, SPACIOUS & USER-FRIENDLY)
          ========================================================================= */}
      {isExpModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsExpModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div>
                <span className="modal-badge">
                  <Briefcase size={14} />
                  <span>Pengalaman Karir</span>
                </span>
                <h2 className="modal-title">
                  {editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsExpModalOpen(false)}
                title="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="admin-modal-form">
              {/* SECTION 1: INFORMASI UTAMA */}
              <div className="modal-section-card">
                <div className="modal-section-title-row">
                  <span className="section-badge-num">1</span>
                  <h4>Informasi Jabatan &amp; Instansi</h4>
                </div>

                <div className="modal-form-grid-2">
                  <div className="admin-field">
                    <label>Nama Jabatan (Role) *</label>
                    <input
                      type="text"
                      required
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="admin-input"
                      placeholder="Contoh: Laboratory Assistant / UI/UX Designer"
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
                      placeholder="Contoh: Web Programming Lab — Unhas"
                    />
                  </div>
                </div>

                <div className="modal-form-grid-2">
                  <div className="admin-field">
                    <label>Jangka Waktu Bulan / Periode *</label>
                    <input
                      type="text"
                      required
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                      className="admin-input"
                      placeholder="Contoh: Agustus 2024 — Sekarang"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Tipe Pengalaman</label>
                    <select
                      value={expForm.type}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                      className="admin-input"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Internship">Internship</option>
                      <option value="Kontrak / Contract">Kontrak / Contract</option>
                      <option value="Community / Project">Community / Project</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                <div className="modal-form-grid-2">
                  <div className="admin-field">
                    <label>Nomor Urutan Tampilan (Sort Order) *</label>
                    <div className="sort-order-modal-row">
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={expForm.sortOrder}
                        onChange={(e) =>
                          setExpForm({
                            ...expForm,
                            sortOrder: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="admin-input sort-order-number-input"
                        placeholder="0"
                      />
                      <div className="sort-order-pill-status">
                        {expForm.sortOrder <= 2 ? (
                          <span className="order-pill-live">
                            ⭐ Beranda #{expForm.sortOrder + 1}
                          </span>
                        ) : (
                          <span className="order-pill-page">
                            📄 /experience #{expForm.sortOrder + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="admin-field-hint">
                      Urutan 0, 1, 2 otomatis tampil pada timeline Beranda. Urutan 3 ke atas tampil di halaman /experience.
                    </span>
                  </div>

                  <div className="admin-field checkbox-cell">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={expForm.isCurrent}
                        onChange={(e) =>
                          setExpForm({ ...expForm, isCurrent: e.target.checked })
                        }
                      />
                      <span>Sedang Aktif Berjalan (Current Role)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 2: RINCIAN JOBDESK */}
              <div className="modal-section-card">
                <div className="modal-section-title-row between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="section-badge-num">2</span>
                    <h4>Rincian Tanggung Jawab / Jobdesk</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addJobdeskPoint}
                    className="admin-btn admin-btn-sm admin-btn-outline"
                  >
                    <Plus size={14} />
                    <span>Tambah Poin Jobdesk</span>
                  </button>
                </div>

                <div className="jobdesk-inputs-list">
                  {(expForm.jobdesk || ['']).map((item, idx) => (
                    <div key={idx} className="jobdesk-input-row">
                      <span className="point-badge">{idx + 1}</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateJobdeskPoint(idx, e.target.value)}
                        className="admin-input"
                        placeholder="Contoh: Merancang user flow, wireframe, dan antarmuka web..."
                      />
                      <button
                        type="button"
                        onClick={() => removeJobdeskPoint(idx)}
                        className="point-remove-btn"
                        title="Hapus poin ini"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: TOOLS & TEKNOLOGI YANG DIGUNAKAN */}
              <div className="modal-section-card">
                <div className="modal-section-title-row">
                  <span className="section-badge-num">3</span>
                  <div>
                    <h4>Tools &amp; Teknologi yang Digunakan</h4>
                    <p className="section-desc-hint">
                      Pilih dari preset tools berlogo atau ketik tool kustom Anda di bawah.
                    </p>
                  </div>
                </div>

                {/* Preset Tools Grid */}
                <div className="modal-tools-chips-grid">
                  {PRESET_TOOLS.map((toolName) => {
                    const isSelected = expForm.tools?.includes(toolName);
                    return (
                      <button
                        key={toolName}
                        type="button"
                        onClick={() => toggleTool(toolName)}
                        className={`modal-tool-chip ${isSelected ? 'active' : ''}`}
                      >
                        <span className="tool-chip-logo-box">
                          {getToolLogo(toolName)}
                        </span>
                        <span>{toolName}</span>
                        {isSelected && <Check size={13} className="chip-check-icon" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Tool Input */}
                <div className="custom-tool-input-row">
                  <input
                    type="text"
                    placeholder="Tambah tool kustom lainnya (contoh: TailwindCSS, Next.js, Python)..."
                    value={customToolInput}
                    onChange={(e) => setCustomToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTool();
                      }
                    }}
                    className="admin-input"
                  />
                  <button
                    type="button"
                    onClick={addCustomTool}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Plus size={15} />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Selected Tools Preview */}
                {expForm.tools && expForm.tools.length > 0 && (
                  <div className="selected-tools-preview-strip">
                    <span className="selected-label">Tools Terpilih ({expForm.tools.length}):</span>
                    <div className="selected-pills-list">
                      {expForm.tools.map((t, idx) => (
                        <span key={idx} className="selected-tool-tag">
                          <span className="tag-logo">{getToolLogo(t)}</span>
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => toggleTool(t)}
                            className="tag-remove-btn"
                            title="Hapus tool"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: FOTO DOKUMENTASI UNTUK 3 FOTO BERTUMPUK */}
              <div className="modal-section-card">
                <div className="modal-section-title-row">
                  <span className="section-badge-num">4</span>
                  <div>
                    <h4>Dokumentasi Foto Pengalaman (Galeri 3 Foto Bertumpuk)</h4>
                    <p className="section-desc-hint">
                      Tarik &amp; lepas (drag &amp; drop) foto langsung ke area di bawah untuk mengunggah otomatis ke Supabase Storage.
                    </p>
                  </div>
                </div>

                {/* Direct Dropzone Area */}
                <div
                  className={`modal-exp-dropzone ${isExpDragOver ? 'drag-active' : ''} ${
                    expUploadLoading ? 'uploading' : ''
                  }`}
                  onDragOver={handleExpDragOver}
                  onDragEnter={handleExpDragOver}
                  onDragLeave={handleExpDragLeave}
                  onDrop={handleExpDrop}
                >
                  <input
                    type="file"
                    id="exp-photo-file-input"
                    multiple
                    accept="image/*"
                    onChange={handleExpPhotoUpload}
                    disabled={expUploadLoading}
                    style={{ display: 'none' }}
                  />

                  {expUploadLoading ? (
                    <div className="dropzone-status-content">
                      <RefreshCw size={28} className="dropzone-spinner" />
                      <div className="dropzone-text-group">
                        <strong className="dropzone-primary-text">
                          Sedang Mengunggah Foto ke Supabase Storage...
                        </strong>
                        <span className="dropzone-sub-text">
                          Foto sedang diproses dan disimpan ke bucket penyimpanan cloud.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="exp-photo-file-input" className="dropzone-label-area">
                      <div className="dropzone-icon-bubble">
                        {isExpDragOver ? <ImagePlus size={28} /> : <UploadCloud size={28} />}
                      </div>
                      <div className="dropzone-text-group">
                        <strong className="dropzone-primary-text">
                          {isExpDragOver ? 'Lepaskan Foto di Sini!' : 'Drop Foto Dokumentasi di Sini'}
                        </strong>
                        <span className="dropzone-sub-text">
                          Tarik &amp; lepas file foto dari komputermu, atau <span className="browse-highlight">klik untuk pilih foto</span>
                        </span>
                        <span className="dropzone-formats-hint">
                          Mendukung PNG, JPG, JPEG, WebP • Bisa drop banyak foto sekaligus
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                {/* Thumbnails of current images */}
                {expForm.images && expForm.images.length > 0 && (
                  <div className="uploaded-photos-wrap">
                    <div className="uploaded-photos-header">
                      <span className="uploaded-count-badge">
                        <CheckCircle2 size={13} />
                        <span>{expForm.images.length} Foto Dokumentasi Terpasang</span>
                      </span>
                      {expForm.images.length >= 3 && (
                        <span className="optimal-photos-note">
                          ✨ Optimal untuk tampilan kartu 3 foto bertumpuk
                        </span>
                      )}
                    </div>

                    <div className="form-image-preview-grid">
                      {expForm.images.map((img, i) => (
                        <div key={i} className="preview-thumb-box">
                          <img src={img.url} alt={`Foto ${i + 1}`} />
                          <span className="preview-thumb-number">Foto {i + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setExpForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, idx) => idx !== i),
                              }));
                            }}
                            className="preview-remove-icon"
                            title="Hapus foto ini"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-lg">
                  <Check size={16} />
                  <span>Simpan Pengalaman ke Website</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ATUR URUTAN SEMUA PENGALAMAN (DRAG & DROP / REORDER MANAGER)
          ========================================================================= */}
      {isReorderModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsReorderModalOpen(false)}>
          <div className="admin-modal-content reorder-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-badge">
                  <ArrowUpDown size={14} />
                  <span>Pengaturan Urutan Fleksibel</span>
                </span>
                <h2 className="modal-title">Atur Susunan Posisi Pengalaman</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsReorderModalOpen(false)}
                title="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="reorder-modal-body">
              <div className="reorder-instructions-box">
                <span className="instructions-icon">💡</span>
                <p>
                  Geser kartu ke atas/bawah menggunakan tombol panah (<strong>▲ / ▼</strong>) atau seret (drag) langsung.
                  <strong> 3 Pengalaman teratas (Urutan #1, #2, #3)</strong> otomatis tampil di Timeline Beranda.
                </p>
              </div>

              <div className="reorder-items-list">
                {reorderList.map((item, idx) => {
                  const isTop3 = idx < 3;
                  return (
                    <div
                      key={item.id || idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDropItem(e, idx)}
                      className={`reorder-item-card ${isTop3 ? 'top-slot' : ''} ${
                        draggedExpIndex === idx ? 'dragging' : ''
                      }`}
                    >
                      <div className="reorder-item-drag-handle" title="Tahan dan geser untuk memindahkan">
                        <GripVertical size={18} />
                      </div>

                      <div className="reorder-rank-pill">
                        <span className="rank-num">#{idx + 1}</span>
                        {isTop3 ? (
                          <span className="rank-home-tag">⭐ Beranda</span>
                        ) : (
                          <span className="rank-page-tag">/experience</span>
                        )}
                      </div>

                      <div className="reorder-item-info">
                        <h4 className="reorder-item-role">{item.role}</h4>
                        <span className="reorder-item-org">{item.organization}</span>
                      </div>

                      <div className="reorder-item-buttons">
                        <button
                          type="button"
                          onClick={() => moveReorderItem(idx, idx - 1)}
                          disabled={idx === 0}
                          className="reorder-arrow-btn"
                          title="Geser ke Atas (▲)"
                          aria-label="Geser ke Atas"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveReorderItem(idx, idx + 1)}
                          disabled={idx === reorderList.length - 1}
                          className="reorder-arrow-btn"
                          title="Geser ke Bawah (▼)"
                          aria-label="Geser ke Bawah"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="admin-btn admin-btn-outline"
                disabled={reorderSaving}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveReorderList}
                disabled={reorderSaving}
                className="admin-btn admin-btn-primary admin-btn-lg"
              >
                {reorderSaving ? <RefreshCw size={16} className="spin-icon" /> : <Check size={16} />}
                <span>{reorderSaving ? 'Menyimpan Susunan...' : 'Simpan Susunan Urutan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT / CREATE PROJECT
          ========================================================================= */}
      {isProjectModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProjectModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-badge">
                  <FolderKanban size={14} />
                  <span>Portfolio Project</span>
                </span>
                <h2 className="modal-title">
                  {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsProjectModalOpen(false)}
                title="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="admin-modal-form">
              <div className="modal-section-card">
                <div className="modal-form-grid-2">
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
                      placeholder="Contoh: PerdosFit Gym Management"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Slug URL (Opsional)</label>
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

                <div className="modal-form-grid-3">
                  <div className="admin-field">
                    <label>Kategori</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const labels = {
                          'ui-ux': 'UI/UX Design',
                          web: 'Web Projects',
                          'graphic-design': 'Graphic Design',
                        };
                        setProjectForm({
                          ...projectForm,
                          category: cat,
                          categoryLabel: labels[cat] || 'Design',
                        });
                      }}
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
                    placeholder="Academic / Diskominfo Makassar"
                  />
                </div>

                <div className="admin-field">
                  <label>Ringkasan Proyek (Summary) *</label>
                  <textarea
                    required
                    rows={3}
                    value={projectForm.summary}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, summary: e.target.value })
                    }
                    className="admin-input"
                    placeholder="Jelaskan secara singkat tujuan dan solusi proyek ini..."
                  />
                </div>

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
                    <label className="admin-btn admin-btn-secondary upload-btn-label">
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
                    <div className="form-cover-preview">
                      <img src={projectForm.coverImage} alt="Cover preview" />
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
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-lg">
                  <Check size={16} />
                  <span>Simpan Proyek</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
