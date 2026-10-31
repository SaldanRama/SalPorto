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
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getToolLogo } from '@/components/experience/ExperienceTools';
import { MiniGalleryCoverflow } from '@/components/gallery/MiniGalleryCoverflow';
import {
  getExperiences,
  saveExperience,
  deleteExperience,
  getProjects,
  saveProject,
  deleteProject,
  getMiniGallery,
  saveMiniGalleryItem,
  deleteMiniGalleryItem,
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
    category: 'graphic-design',
    categoryLabel: 'Graphic Design & Visual Identity',
    year: new Date().getFullYear(),
    role: '',
    projectType: 'Case Study',
    summary: '',
    headline: '',
    instagramUrl: '',
    coverImage: '',
    featured: true,
    published: true,
    sortOrder: 0,
    tools: ['Photoshop', 'Canva'],
    tags: ['Graphic Design', 'Visual Identity'],
    scopes: ['Graphic Design', 'Visual Identity'],
    gallery: [],
  });

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState(null);
  const [isBatchUploadingSlides, setIsBatchUploadingSlides] = useState(false);
  const [customProjTool, setCustomProjTool] = useState('');
  const [customProjScope, setCustomProjScope] = useState('');
  const coverFileInputRef = useRef(null);
  const batchSlideFileInputRef = useRef(null);

  // Mini Gallery State (16:9 Coverflow)
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [showLiveCoverflow, setShowLiveCoverflow] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const galleryFileInputRef = useRef(null);
  const modalGalleryFileInputRef = useRef(null);

  const [galleryForm, setGalleryForm] = useState({
    id: '',
    title: '',
    caption: '',
    url: '',
    assetId: '',
    linkUrl: '',
    sortOrder: 0,
    published: true,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [eList, pList, gList] = await Promise.all([
        getExperiences(),
        getProjects(),
        getMiniGallery(),
      ]);
      setExperiences(eList || []);
      setProjects(pList || []);
      setGalleryItems(gList || []);
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
      setIsModalOpen(true);
    } else if (activeTab === 'projects') {
      setEditingItem(null);
      setCustomProjTool('');
      setCustomProjScope('');
      setProjForm({
        id: `project-${Date.now()}`,
        title: '',
        slug: '',
        category: 'graphic-design',
        categoryLabel: 'Graphic Design & Visual Identity',
        year: new Date().getFullYear(),
        role: '',
        projectType: 'Case Study',
        summary: '',
        headline: '',
        instagramUrl: '',
        coverImage: '',
        featured: true,
        published: true,
        sortOrder: projects.length + 1,
        tools: ['Photoshop', 'Canva'],
        tags: ['Graphic Design', 'Visual Identity'],
        scopes: ['Graphic Design', 'Visual Identity'],
        gallery: [],
      });
      setIsModalOpen(true);
    } else if (activeTab === 'gallery') {
      handleOpenAddGalleryModal();
    }
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
    setCustomProjTool('');
    setCustomProjScope('');

    const formattedGallery = Array.isArray(proj.gallery)
      ? proj.gallery.map((g, i) => ({
          _key: g._key || g.id || `slide-${i}`,
          id: g.id || `slide-${i + 1}`,
          title: g.title || '',
          category: g.category || '',
          caption: g.caption || '',
          src: g.src || g.url || '',
        }))
      : [];

    setProjForm({
      id: proj.id || proj._id,
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'graphic-design',
      categoryLabel: proj.categoryLabel || '',
      year: proj.year || new Date().getFullYear(),
      role: proj.role || '',
      projectType: proj.projectType || 'Case Study',
      summary: proj.summary || '',
      headline: proj.headline || '',
      instagramUrl: proj.instagramUrl || proj.instagram || '',
      coverImage: proj.coverImage || proj.cover_image || '',
      featured: proj.featured ?? true,
      published: proj.published ?? true,
      sortOrder: proj.sortOrder ?? 0,
      tools: Array.isArray(proj.tools) && proj.tools.length > 0 ? [...proj.tools] : (Array.isArray(proj.tags) ? [...proj.tags] : []),
      tags: Array.isArray(proj.tags) ? [...proj.tags] : [],
      scopes: Array.isArray(proj.scopes) ? [...proj.scopes] : [],
      gallery: formattedGallery,
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

  // Project Cover Upload & Handlers
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const res = await uploadImageToSanity(file);
      if (res?.url) {
        setProjForm((prev) => ({ ...prev, coverImage: res.url }));
        showToast('Gambar 1 (Cover Proyek) berhasil diunggah ke Sanity!');
      } else {
        alert('Gagal mengunggah cover image.');
      }
    } catch (err) {
      alert('Error mengunggah cover: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const handleRemoveCover = () => {
    setProjForm((prev) => ({ ...prev, coverImage: '' }));
  };

  // Slide Presentasi Handlers (Gambar 2 s.d. N)
  const handleAddSlide = () => {
    setProjForm((prev) => ({
      ...prev,
      gallery: [
        ...(prev.gallery || []),
        {
          id: `slide-${Date.now()}`,
          title: '',
          category: 'Presentation Asset',
          caption: '',
          src: '',
        },
      ],
    }));
  };

  const handleUpdateSlideField = (index, field, value) => {
    setProjForm((prev) => {
      const updated = [...(prev.gallery || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gallery: updated };
    });
  };

  const handleRemoveSlide = (index) => {
    setProjForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleMoveSlide = (index, direction) => {
    setProjForm((prev) => {
      const list = [...(prev.gallery || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, gallery: list };
    });
  };

  const handleSlideImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingSlideIndex(index);
    try {
      const res = await uploadImageToSanity(file);
      if (res?.url) {
        setProjForm((prev) => {
          const updated = [...(prev.gallery || [])];
          updated[index] = { ...updated[index], src: res.url };
          return { ...prev, gallery: updated };
        });
        showToast(`Gambar Slide 0${index + 2} berhasil diunggah!`);
      } else {
        alert('Gagal mengunggah gambar slide.');
      }
    } catch (err) {
      alert('Error mengunggah slide: ' + (err.message || 'Error'));
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const handleBatchSlideUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsBatchUploadingSlides(true);
    const newSlides = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImageToSanity(file);
        if (res?.url) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
          newSlides.push({
            id: `slide-${Date.now()}-${i}`,
            title: cleanName,
            category: 'Presentation Asset',
            caption: '',
            src: res.url,
          });
        }
      }
      if (newSlides.length > 0) {
        setProjForm((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...newSlides],
        }));
        showToast(`${newSlides.length} slide presentasi berhasil ditambahkan!`);
      }
    } catch (err) {
      alert('Error batch upload slide: ' + (err.message || 'Error'));
    } finally {
      setIsBatchUploadingSlides(false);
      if (batchSlideFileInputRef.current) batchSlideFileInputRef.current.value = '';
    }
  };

  // Tools & Ruang Lingkup Handlers
  const handleToggleProjTool = (tool) => {
    setProjForm((prev) => {
      const cur = prev.tools || [];
      if (cur.includes(tool)) {
        return { ...prev, tools: cur.filter((t) => t !== tool) };
      }
      return { ...prev, tools: [...cur, tool] };
    });
  };

  const handleAddCustomProjTool = (e) => {
    if (e) e.preventDefault();
    if (!customProjTool.trim()) return;
    const val = customProjTool.trim();
    setProjForm((prev) => {
      const cur = prev.tools || [];
      if (cur.includes(val)) return prev;
      return { ...prev, tools: [...cur, val] };
    });
    setCustomProjTool('');
  };

  const handleRemoveProjTool = (tool) => {
    setProjForm((prev) => ({
      ...prev,
      tools: (prev.tools || []).filter((t) => t !== tool),
    }));
  };

  const handleAddCustomProjScope = (e) => {
    if (e) e.preventDefault();
    if (!customProjScope.trim()) return;
    const val = customProjScope.trim();
    setProjForm((prev) => {
      const cur = prev.scopes || [];
      if (cur.includes(val)) return prev;
      return { ...prev, scopes: [...cur, val] };
    });
    setCustomProjScope('');
  };

  const handleRemoveProjScope = (scope) => {
    setProjForm((prev) => ({
      ...prev,
      scopes: (prev.scopes || []).filter((s) => s !== scope),
    }));
  };

  // Save Project to Sanity
  const handleSaveProjSubmit = async (e) => {
    e.preventDefault();
    if (!projForm.title.trim()) {
      alert('Mohon isi Judul Proyek.');
      return;
    }

    setIsSaving(true);
    const toSave = {
      ...projForm,
      title: projForm.title.trim(),
      slug: (projForm.slug || projForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim(),
      year: Number(projForm.year) || new Date().getFullYear(),
      sortOrder: Number(projForm.sortOrder || 0),
      gallery: (projForm.gallery || []).filter((g) => g && (g.src || g.title || g.url)),
    };

    const res = await saveProject(toSave);
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

  // Mini Gallery CRUD & Helpers
  const handleOpenAddGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      id: `gallery-${Date.now()}`,
      title: '',
      caption: '',
      url: '',
      assetId: '',
      linkUrl: '',
      sortOrder: galleryItems.length,
      published: true,
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGalleryModal = (e, item) => {
    if (e) e.stopPropagation();
    setEditingGalleryItem(item);
    setGalleryForm({
      id: item.id || item._id,
      title: item.title || '',
      caption: item.caption || '',
      url: item.url || '',
      assetId: item.assetId || item.asset?._ref || '',
      linkUrl: item.linkUrl || '',
      sortOrder: item.sortOrder ?? 0,
      published: item.published ?? true,
      image: item.image,
    });
    setIsGalleryModalOpen(true);
  };

  const handleModalGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGallery(true);
    const res = await uploadImageToSanity(file);
    setIsUploadingGallery(false);

    if (res?.asset) {
      setGalleryForm((prev) => ({
        ...prev,
        url: res.url,
        assetId: res.asset._id,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      showToast('Gambar 16:9 berhasil diunggah!');
    }
    e.target.value = '';
  };

  const handleDirectGalleryUpload = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    let count = 0;
    for (const file of files) {
      try {
        const res = await uploadImageToSanity(file);
        if (res?.asset) {
          count++;
          const titleFromFilename = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          await saveMiniGalleryItem({
            id: `gallery-${Date.now()}-${count}`,
            title: titleFromFilename,
            caption: 'Visual Karya 16:9',
            url: res.url,
            assetId: res.asset._id,
            sortOrder: galleryItems.length + count - 1,
            published: true,
          });
        }
      } catch (err) {
        console.error('Direct gallery upload error:', err);
      }
    }

    if (count > 0) {
      showToast(`${count} gambar 16:9 berhasil ditambahkan ke Mini Galeri!`);
      await loadData();
    }
    setIsUploadingGallery(false);
  };

  const handleGalleryDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingGallery) setIsDraggingGallery(true);
  };

  const handleGalleryDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(true);
  };

  const handleGalleryDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDraggingGallery(false);
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(false);
    if (e.dataTransfer?.files?.length > 0) {
      handleDirectGalleryUpload(e.dataTransfer.files);
    }
  };

  const handleSaveGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert('Mohon isi Judul Gambar / Proyek.');
      return;
    }
    if (!galleryForm.url && !galleryForm.assetId) {
      alert('Mohon unggah file gambar (rasio 16:9 disarankan).');
      return;
    }

    setIsSaving(true);
    const res = await saveMiniGalleryItem(galleryForm);
    setIsSaving(false);

    if (res?.error) {
      alert('Gagal menyimpan ke Sanity: ' + (res.error.message || 'Error'));
      return;
    }

    showToast(`Gambar "${galleryForm.title}" berhasil disimpan ke Mini Galeri!`);
    setIsGalleryModalOpen(false);
    await loadData();
  };

  const handleDeleteGalleryItem = async (e, item) => {
    e.stopPropagation();
    if (window.confirm(`Hapus gambar "${item.title}" dari Mini Galeri?`)) {
      const res = await deleteMiniGalleryItem(item.id || item._id);
      if (res?.error) {
        alert('Gagal menghapus: ' + res.error.message);
        return;
      }
      showToast(`Gambar "${item.title}" berhasil dihapus.`);
      await loadData();
    }
  };

  const handleMoveGalleryItem = async (e, index, direction) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const newItems = [...galleryItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    newItems.forEach((it, i) => {
      it.sortOrder = i;
    });

    setGalleryItems(newItems);

    await Promise.all([
      saveMiniGalleryItem({ ...newItems[index], sortOrder: index }),
      saveMiniGalleryItem({ ...newItems[targetIndex], sortOrder: targetIndex }),
    ]);
    showToast('Urutan carousel 16:9 diperbarui!');
  };

  const filteredGalleryItems = galleryItems
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.caption?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

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
              className={`sp-sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <Sparkles size={18} />
              <span>Mini Galeri</span>
              <span
                className="sp-sidebar-badge"
                style={{ background: '#10b981', color: '#ffffff', fontSize: '0.675rem', fontWeight: 700 }}
              >
                {galleryItems.length} (16:9)
              </span>
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
                {activeTab === 'experiences'
                  ? 'Tambah Pengalaman'
                  : activeTab === 'projects'
                  ? 'Tambah Proyek'
                  : 'Tambah Gambar 16:9'}
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
                  : 'Mini Galeri (16:9 Coverflow)'}
              </h1>
              <p className="sp-content-subtitle">
                Total:{' '}
                <strong>
                  {activeTab === 'experiences'
                    ? `${filteredExperiences.length} Riwayat Pengalaman`
                    : activeTab === 'projects'
                    ? `${filteredProjects.length} Proyek`
                    : `${filteredGalleryItems.length} Gambar 16:9`}
                </strong>
                {activeTab === 'experiences' && (
                  <span> • Urutan [#0], [#1], [#2] otomatis tampil di Timeline Beranda Website</span>
                )}
                {activeTab === 'gallery' && (
                  <span> • Bergeser otomatis 1 detik di Coverflow Carousel Beranda</span>
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

          {/* ================================================================
              MINI GALLERY: 16:9 COVERFLOW CAROUSEL MANAGEMENT
              ================================================================ */}
          {activeTab === 'gallery' && (
            <div className="sp-gallery-management-wrap">
              {/* Hero Banner & Live Preview Toggle */}
              <div className="sp-gallery-hero-bar">
                <div>
                  <div className="sp-gallery-tag-pill">
                    <Sparkles size={13} />
                    <span>Rasio 16:9 • Auto-Rotate 1s • Manual Drag/Swipe</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', margin: '0.4rem 0 0.2rem 0', fontWeight: 800 }}>
                    Koleksi Mini Galeri Coverflow
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--sp-muted)', margin: 0 }}>
                    Kelola foto karya &amp; proyek format 16:9 yang tampil pada 3D Coverflow di halaman beranda.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`sp-btn-preview-coverflow ${showLiveCoverflow ? 'active' : ''}`}
                    onClick={() => setShowLiveCoverflow((prev) => !prev)}
                  >
                    {showLiveCoverflow ? <EyeOff size={15} /> : <Eye size={15} />}
                    <span>{showLiveCoverflow ? 'Tutup Pratinjau' : 'Lihat Pratinjau Live (1s)'}</span>
                  </button>

                  <button
                    type="button"
                    className="sp-btn-add-gallery-item"
                    onClick={handleOpenAddGalleryModal}
                  >
                    <Plus size={15} strokeWidth={2.8} />
                    <span>+ Tambah Gambar 16:9</span>
                  </button>
                </div>
              </div>

              {/* Embedded Live 3D Coverflow Preview inside Admin */}
              {showLiveCoverflow && (
                <div className="sp-gallery-live-preview-box">
                  <div className="sp-live-preview-header">
                    <span className="sp-live-preview-title">
                      👁 Pratinjau Langsung Carousel Beranda (Bergeser otomatis 1 detik)
                    </span>
                    <button
                      type="button"
                      className="sp-btn-close-preview"
                      onClick={() => setShowLiveCoverflow(false)}
                      title="Tutup Pratinjau"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <MiniGalleryCoverflow />
                </div>
              )}

              {/* Fast Drag & Drop 16:9 Upload Dropzone */}
              <div
                className={`sp-gallery-dropzone-hero ${isDraggingGallery ? 'is-dragging' : ''}`}
                onDragEnter={handleGalleryDragEnter}
                onDragOver={handleGalleryDragOver}
                onDragLeave={handleGalleryDragLeave}
                onDrop={handleGalleryDrop}
                onClick={() => galleryFileInputRef.current?.click()}
              >
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleDirectGalleryUpload(e.target.files);
                    }
                    e.target.value = '';
                  }}
                  style={{ display: 'none' }}
                  disabled={isUploadingGallery}
                />
                <div className="sp-dropzone-hero-icon-box">
                  <Upload
                    size={28}
                    className={isDraggingGallery ? 'sp-bounce-anim' : ''}
                    color={isDraggingGallery ? '#10b981' : 'var(--sp-accent)'}
                  />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                    {isUploadingGallery
                      ? '⏳ Sedang mengunggah foto ke Sanity CDN...'
                      : isDraggingGallery
                      ? '📂 Lepaskan foto 16:9 di sini sekarang!'
                      : 'Seret & Lepas Gambar 16:9 ke sini, atau Klik untuk Memilih'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--sp-muted)' }}>
                    Format PNG, JPG, WebP (Rasio 16:9 disarankan) • Otomatis disimpan ke Sanity Image Assets
                  </p>
                </div>
              </div>

              {/* Grid of 16:9 Cards */}
              <div className="sp-gallery-cards-grid">
                {filteredGalleryItems.map((item, index) => (
                  <div key={item.id || item._id || index} className="sp-gallery-card-16-9">
                    {/* 16:9 Media Box */}
                    <div className="sp-gallery-thumb-16-9">
                      <img src={item.url} alt={item.title} />
                      <span className="sp-gallery-ratio-pill">16 : 9</span>
                      <span className="sp-gallery-order-pill">#{index + 1}</span>
                      {item.isDefault && (
                        <span className="sp-gallery-demo-pill">Default</span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="sp-gallery-card-content">
                      <div className="sp-gallery-info-main">
                        <h4 className="sp-gallery-card-title">{item.title}</h4>
                        {item.caption && (
                          <p className="sp-gallery-card-caption">{item.caption}</p>
                        )}
                        {item.linkUrl && (
                          <span className="sp-gallery-card-link">
                            🔗 {item.linkUrl}
                          </span>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="sp-gallery-card-actions">
                        <div className="sp-gallery-order-btns">
                          <button
                            type="button"
                            className="sp-gallery-action-btn"
                            disabled={index === 0}
                            onClick={(e) => handleMoveGalleryItem(e, index, 'up')}
                            title="Geser ke urutan sebelumnya"
                          >
                            <ChevronUp size={15} />
                          </button>
                          <button
                            type="button"
                            className="sp-gallery-action-btn"
                            disabled={index === galleryItems.length - 1}
                            onClick={(e) => handleMoveGalleryItem(e, index, 'down')}
                            title="Geser ke urutan berikutnya"
                          >
                            <ChevronDown size={15} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="sp-gallery-action-btn edit"
                            onClick={(e) => handleOpenEditGalleryModal(e, item)}
                            title="Edit Gambar"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="sp-gallery-action-btn delete"
                            onClick={(e) => handleDeleteGalleryItem(e, item)}
                            title="Hapus"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          MODAL DIALOG: PROYEK (Lengkap & Fleksibel)
          ==================================================================== */}
      {isModalOpen && activeTab === 'projects' && (
        <div className="sp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '920px' }}>
            <div className="sp-modal-head">
              <h2>{editingItem ? `Edit Proyek: ${projForm.title || 'Tanpa Judul'}` : 'Tambah Proyek Baru'}</h2>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="sp-modal-form" onSubmit={handleSaveProjSubmit}>
              <div className="sp-modal-scroll-body" style={{ gap: '1.75rem' }}>

                {/* 1. INFORMASI DASAR & IDENTITAS */}
                <div className="sp-project-section-card">
                  <div className="sp-project-section-head">
                    <h3 className="sp-project-section-title">
                      <FolderGit2 size={18} color="var(--sp-accent)" />
                      1. Identitas &amp; Pengaturan Proyek
                    </h3>
                    <p className="sp-project-section-desc">
                      Atur judul, URL permalink, kategori, dan visibilitas proyek di website.
                    </p>
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">Judul Proyek *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KKN-T 114 Kel. Lakessi"
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">Slug URL / Permalink</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--sp-muted)', fontFamily: 'monospace' }}>/work/</span>
                      <input
                        type="text"
                        placeholder="lakessi"
                        value={projForm.slug}
                        onChange={(e) =>
                          setProjForm({
                            ...projForm,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                          })
                        }
                        className="sp-input-field"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="sp-input-label">Kategori Utama</label>
                      <select
                        value={projForm.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          let defaultLbl = 'UI/UX Design';
                          if (val === 'graphic-design') defaultLbl = 'Graphic Design & Visual Identity';
                          else if (val === 'web') defaultLbl = 'Web Projects';
                          setProjForm({
                            ...projForm,
                            category: val,
                            categoryLabel: projForm.categoryLabel || defaultLbl,
                          });
                        }}
                        className="sp-select-field"
                      >
                        <option value="graphic-design">Graphic Design</option>
                        <option value="ui-ux">UI/UX Design</option>
                        <option value="web">Web Projects</option>
                      </select>
                    </div>

                    <div>
                      <label className="sp-input-label">Label Kategori Kustom</label>
                      <input
                        type="text"
                        placeholder="e.g. Graphic Design & Visual Identity"
                        value={projForm.categoryLabel}
                        onChange={(e) => setProjForm({ ...projForm, categoryLabel: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>

                    <div>
                      <label className="sp-input-label">Tahun Pembuatan</label>
                      <input
                        type="number"
                        value={projForm.year}
                        onChange={(e) =>
                          setProjForm({ ...projForm, year: parseInt(e.target.value, 10) || new Date().getFullYear() })
                        }
                        className="sp-input-field"
                      />
                    </div>

                    <div>
                      <label className="sp-input-label">Urutan Tampil (Sort Order)</label>
                      <input
                        type="number"
                        value={projForm.sortOrder}
                        onChange={(e) =>
                          setProjForm({ ...projForm, sortOrder: parseInt(e.target.value, 10) || 0 })
                        }
                        className="sp-input-field"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--sp-text)' }}>
                      <input
                        type="checkbox"
                        checked={projForm.published}
                        onChange={(e) => setProjForm({ ...projForm, published: e.target.checked })}
                      />
                      <span>🟢 Publikasikan Live di Website</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--sp-text)' }}>
                      <input
                        type="checkbox"
                        checked={projForm.featured}
                        onChange={(e) => setProjForm({ ...projForm, featured: e.target.checked })}
                      />
                      <span>⭐ Tampilkan di Beranda (Selected Work)</span>
                    </label>
                  </div>
                </div>

                {/* 2. GAMBAR 1 / HERO COVER SHOWCASE */}
                <div className="sp-project-section-card">
                  <div className="sp-project-section-head">
                    <h3 className="sp-project-section-title">
                      <ImageIcon size={18} color="var(--sp-accent)" />
                      2. Gambar Utama (Gambar 1 / Hero Visual Showcase)
                    </h3>
                    <p className="sp-project-section-desc">
                      Gambar ini tampil tepat di bawah judul proyek pada halaman detail, serta menjadi thumbnail cover di daftar proyek.
                    </p>
                  </div>

                  {projForm.coverImage ? (
                    <div className="sp-project-cover-box has-image">
                      <img src={projForm.coverImage} alt="Cover Proyek" className="sp-project-cover-img" />
                      <div className="sp-cover-overlay-actions">
                        <button
                          type="button"
                          className="sp-cover-btn-action"
                          onClick={() => coverFileInputRef.current?.click()}
                          disabled={isUploadingCover}
                        >
                          <Upload size={14} />
                          <span>{isUploadingCover ? 'Mengunggah...' : 'Ganti Gambar'}</span>
                        </button>
                        <button
                          type="button"
                          className="sp-cover-btn-action danger"
                          onClick={handleRemoveCover}
                        >
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="sp-upload-dropzone"
                      onClick={() => coverFileInputRef.current?.click()}
                      style={{ cursor: 'pointer', padding: '2.5rem 1.5rem', textAlign: 'center' }}
                    >
                      <Upload size={32} color="var(--sp-accent)" style={{ marginBottom: '0.75rem' }} />
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--sp-text)', fontSize: '0.95rem' }}>
                        {isUploadingCover ? 'Mengunggah ke Sanity CDN...' : 'Klik untuk Unggah Gambar 1 (Cover / Hero 16:9)'}
                      </p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--sp-muted)', marginTop: '0.25rem', display: 'block' }}>
                        Format PNG, JPG, atau WebP (Disarankan rasio 16:9)
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={coverFileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleCoverUpload}
                  />

                  <div className="sp-field">
                    <label className="sp-input-label">Atau Tempel Tautan / Path Gambar Langsung</label>
                    <input
                      type="text"
                      placeholder="e.g. /images/projects/Lakessi/1.png atau https://..."
                      value={projForm.coverImage}
                      onChange={(e) => setProjForm({ ...projForm, coverImage: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>
                </div>

                {/* 3. TEKS EDITORIAL & SPESIFIKASI */}
                <div className="sp-project-section-card">
                  <div className="sp-project-section-head">
                    <h3 className="sp-project-section-title">
                      <Sparkles size={18} color="var(--sp-accent)" />
                      3. Teks Editorial &amp; Spesifikasi (Spec Strip)
                    </h3>
                    <p className="sp-project-section-desc">
                      Tuliskan narasi masalah/solusi serta informasi spesifikasi peran dan institusi.
                    </p>
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">Tagline / Headline Proyek</label>
                    <input
                      type="text"
                      placeholder="e.g. Local micro-enterprises lacking cohesive visual branding, packaging, and digital reach."
                      value={projForm.headline}
                      onChange={(e) => setProjForm({ ...projForm, headline: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">Ringkasan Lengkap Proyek (Summary)</label>
                    <textarea
                      rows={4}
                      placeholder="Jelaskan ruang lingkup, latar belakang, dan hasil akhir proyek ini..."
                      value={projForm.summary}
                      onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                      className="sp-textarea-field"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="sp-field">
                      <label className="sp-input-label">Peran Anda (Role)</label>
                      <input
                        type="text"
                        placeholder="e.g. Visual Identity & Branding Specialist"
                        value={projForm.role}
                        onChange={(e) => setProjForm({ ...projForm, role: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>

                    <div className="sp-field">
                      <label className="sp-input-label">Konteks / Instansi (Institution)</label>
                      <input
                        type="text"
                        placeholder="e.g. Community Service & UMKM Rebranding"
                        value={projForm.projectType}
                        onChange={(e) => setProjForm({ ...projForm, projectType: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">
                      <InstagramIcon size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
                      Link Instagram Proyek (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.instagram.com/mipabasketball atau @mipabasketball"
                      value={projForm.instagramUrl || ''}
                      onChange={(e) => setProjForm({ ...projForm, instagramUrl: e.target.value })}
                      className="sp-input-field"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--sp-muted)', marginTop: '0.25rem', display: 'block' }}>
                      Tombol logo Instagram akan tampil di sebelah kanan judul proyek pada halaman detail.
                    </span>
                  </div>
                </div>

                {/* 4. SLIDE PRESENTASI (GAMBAR 2 S.D. N) */}
                <div className="sp-project-section-card">
                  <div className="sp-project-section-head">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <h3 className="sp-project-section-title">
                        <Layers size={18} color="var(--sp-accent)" />
                        4. Slide Presentasi (Gambar 2 s.d. N / Horizontal Slide Deck)
                      </h3>
                      <span className="sp-slide-badge">
                        Total {(projForm.gallery || []).length} Slide
                      </span>
                    </div>
                    <p className="sp-project-section-desc">
                      Koleksi slide ini akan tampil dalam fullscreen horizontal slide-on-scroll. Urutan slide dapat digeser naik/turun, gambar dapat diunggah atau diganti kapan saja.
                    </p>
                  </div>

                  {/* Action Bar for Slides */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="sp-btn-secondary"
                      onClick={handleAddSlide}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1rem' }}
                    >
                      <Plus size={16} />
                      <span>+ Tambah Slide Baru</span>
                    </button>

                    <button
                      type="button"
                      className="sp-btn-secondary"
                      onClick={() => batchSlideFileInputRef.current?.click()}
                      disabled={isBatchUploadingSlides}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1rem' }}
                    >
                      <Upload size={16} />
                      <span>{isBatchUploadingSlides ? 'Mengunggah Banyak Gambar...' : 'Upload Banyak Gambar (Batch)'}</span>
                    </button>

                    <input
                      type="file"
                      ref={batchSlideFileInputRef}
                      style={{ display: 'none' }}
                      multiple
                      accept="image/*"
                      onChange={handleBatchSlideUpload}
                    />
                  </div>

                  {/* List of Slide Cards */}
                  <div className="sp-slide-list">
                    {(projForm.gallery || []).map((slide, sIdx) => {
                      const slideDisplayNum = sIdx + 2; // Because Gambar 1 is Hero
                      return (
                        <div key={slide.id || sIdx} className="sp-slide-card">
                          <div className="sp-slide-card-header">
                            <span className="sp-slide-badge">
                              Slide 0{slideDisplayNum} (Gambar {slideDisplayNum})
                            </span>

                            <div className="sp-slide-actions">
                              <button
                                type="button"
                                className="sp-slide-icon-btn"
                                onClick={() => handleMoveSlide(sIdx, -1)}
                                disabled={sIdx === 0}
                                title="Geser ke atas"
                              >
                                <ChevronUp size={16} />
                              </button>
                              <button
                                type="button"
                                className="sp-slide-icon-btn"
                                onClick={() => handleMoveSlide(sIdx, 1)}
                                disabled={sIdx === projForm.gallery.length - 1}
                                title="Geser ke bawah"
                              >
                                <ChevronDown size={16} />
                              </button>
                              <button
                                type="button"
                                className="sp-slide-icon-btn danger"
                                onClick={() => handleRemoveSlide(sIdx)}
                                title="Hapus slide ini"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div className="sp-slide-card-body">
                            {/* Left: Thumbnail & Image Upload / URL */}
                            <div className="sp-slide-media-col">
                              <div className="sp-slide-thumb-box">
                                {slide.src ? (
                                  <img src={slide.src} alt={slide.title || `Slide ${slideDisplayNum}`} className="sp-slide-thumb-img" />
                                ) : (
                                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--sp-muted)' }}>
                                    <ImageIcon size={28} style={{ opacity: 0.6, marginBottom: '0.25rem' }} />
                                    <div style={{ fontSize: '0.75rem' }}>Belum ada gambar</div>
                                  </div>
                                )}
                              </div>

                              <label
                                className="sp-btn-secondary"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.45rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  padding: '0.45rem 0.75rem',
                                }}
                              >
                                <Upload size={14} />
                                <span>{uploadingSlideIndex === sIdx ? 'Mengunggah...' : 'Pilih / Unggah File'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  disabled={uploadingSlideIndex === sIdx}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleSlideImageUpload(sIdx, file);
                                  }}
                                />
                              </label>

                              <input
                                type="text"
                                placeholder="Atau tautan URL / path..."
                                value={slide.src || ''}
                                onChange={(e) => handleUpdateSlideField(sIdx, 'src', e.target.value)}
                                className="sp-input-field"
                                style={{ fontSize: '0.78rem' }}
                              />
                            </div>

                            {/* Right: Title, Category, Caption */}
                            <div className="sp-slide-fields-col">
                              <div>
                                <label className="sp-input-label">Judul Slide</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Project Brief, Scopes & Design System"
                                  value={slide.title || ''}
                                  onChange={(e) => handleUpdateSlideField(sIdx, 'title', e.target.value)}
                                  className="sp-input-field"
                                />
                              </div>

                              <div>
                                <label className="sp-input-label">Kategori Slide</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Brand Specifications / Social Media"
                                  value={slide.category || ''}
                                  onChange={(e) => handleUpdateSlideField(sIdx, 'category', e.target.value)}
                                  className="sp-input-field"
                                />
                              </div>

                              <div>
                                <label className="sp-input-label">Keterangan / Caption Slide</label>
                                <textarea
                                  rows={2}
                                  placeholder="Deskripsi singkat tentang gambar atau desain pada slide ini..."
                                  value={slide.caption || ''}
                                  onChange={(e) => handleUpdateSlideField(sIdx, 'caption', e.target.value)}
                                  className="sp-textarea-field"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {(projForm.gallery || []).length === 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '2.5rem 1rem',
                          border: '1px dashed var(--sp-border)',
                          borderRadius: '12px',
                          color: 'var(--sp-muted)',
                        }}
                      >
                        <Layers size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--sp-text)' }}>
                          Belum ada slide presentasi (Gambar 2 s.d. N)
                        </p>
                        <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                          Klik tombol &quot;+ Tambah Slide Baru&quot; atau &quot;Upload Banyak Gambar (Batch)&quot; untuk memulai.
                        </span>
                      </div>
                    )}
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
                  {isSaving ? 'Menyimpan ke Sanity...' : 'Simpan & Publikasikan Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DIALOG: MINI GALLERY ITEM (16:9)
          ==================================================================== */}
      {isGalleryModalOpen && (
        <div className="sp-modal-overlay" onClick={() => setIsGalleryModalOpen(false)}>
          <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h2>{editingGalleryItem ? 'Edit Gambar Mini Galeri' : 'Tambah Gambar Mini Galeri (16:9)'}</h2>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setIsGalleryModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="sp-modal-form" onSubmit={handleSaveGallerySubmit}>
              <div className="sp-modal-scroll-body">
                {/* 16:9 Photo Preview / Upload Dropzone */}
                <div className="sp-form-section">
                  <h3 className="sp-section-heading">
                    <Camera size={16} />
                    <span>File Gambar (Rasio 16:9 Disarankan)</span>
                  </h3>

                  {galleryForm.url ? (
                    <div className="sp-modal-16-9-preview">
                      <img src={galleryForm.url} alt="Pratinjau 16:9" />
                      <div className="sp-modal-16-9-overlay">
                        <button
                          type="button"
                          className="sp-btn-replace-photo"
                          onClick={() => modalGalleryFileInputRef.current?.click()}
                        >
                          <Upload size={14} />
                          <span>Ganti Gambar 16:9</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="sp-upload-dropzone"
                      onClick={() => modalGalleryFileInputRef.current?.click()}
                    >
                      <Upload size={28} color="var(--sp-accent)" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {isUploadingGallery ? 'Mengunggah ke Sanity CDN...' : 'Klik untuk memilih gambar 16:9'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sp-muted)' }}>
                        Resolusi optimal: 1920×1080 atau 1280×720 (PNG, JPG, WebP)
                      </span>
                    </div>
                  )}

                  <input
                    ref={modalGalleryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleModalGalleryUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Information Fields */}
                <div className="sp-form-section">
                  <div className="sp-field">
                    <label className="sp-input-label">Judul Gambar / Proyek *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SIMRS RSUD Hasanuddin Mobile App"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>

                  <div className="sp-field">
                    <label className="sp-input-label">Keterangan Singkat / Kategori (Opsional)</label>
                    <input
                      type="text"
                      placeholder="e.g. UI/UX Design • Double Diamond Concept"
                      value={galleryForm.caption}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="sp-input-field"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div className="sp-field">
                      <label className="sp-input-label">Tautan / Link Proyek (Opsional)</label>
                      <input
                        type="text"
                        placeholder="e.g. /work/perdosfit atau https://..."
                        value={galleryForm.linkUrl}
                        onChange={(e) => setGalleryForm({ ...galleryForm, linkUrl: e.target.value })}
                        className="sp-input-field"
                      />
                    </div>

                    <div className="sp-field">
                      <label className="sp-input-label">Urutan Tampil (Sort)</label>
                      <input
                        type="number"
                        value={galleryForm.sortOrder}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, sortOrder: parseInt(e.target.value, 10) || 0 })
                        }
                        className="sp-input-field"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={galleryForm.published}
                        onChange={(e) => setGalleryForm({ ...galleryForm, published: e.target.checked })}
                      />
                      <span>Tampilkan di Mini Gallery Beranda</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="sp-modal-foot">
                <button
                  type="button"
                  className="sp-btn-cancel"
                  onClick={() => setIsGalleryModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="sp-btn-save-submit" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan ke Mini Galeri'}
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
