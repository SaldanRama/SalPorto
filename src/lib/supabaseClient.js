import { createClient } from '@supabase/supabase-js';
import { mockProjects, mockExperiences } from '@/data/mockData';

// Extract credentials from Vite environment variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://qarvsujzxunsyktofquu.supabase.co';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_Wux1sgLxGOKDuue1wKCB3Q_xQNFMsQ8';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));
};

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = 'portfolio-images';

/**
 * Upload an image file directly to Supabase Storage
 * @param {File} file - The file from <input type="file">
 * @param {string} folder - Destination subfolder, e.g. 'projects' or 'experiences'
 * @returns {Promise<{ url: string, path: string, error: any }>}
 */
export async function uploadImageToStorage(file, folder = 'uploads') {
  if (!file) return { url: null, path: null, error: 'No file provided' };

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const uniquePath = `${folder}/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return { url: null, path: null, error };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return { url: null, path: null, error: err };
  }
}

/**
 * Fetch projects from Supabase with graceful fallback to localStorage and mockProjects
 */
export async function getProjects() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });

      if (!error && data && data.length > 0) {
        const normalized = data.map((p) => ({
          ...p,
          categoryLabel: p.category_label || p.categoryLabel,
          projectType: p.project_type || p.projectType,
          coverImage: p.cover_image || p.coverImage,
        }));
        localStorage.setItem('salporto_projects', JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Falling back to local projects data:', err);
  }

  // Fallback to localStorage or mockProjects
  const cached = localStorage.getItem('salporto_projects');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {}
  }

  return mockProjects;
}

/**
 * Save / Update project (Supabase + localStorage sync)
 */
export async function saveProject(projectData) {
  const row = {
    id: String(projectData.id || `proj-${Date.now()}`),
    slug:
      projectData.slug ||
      projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `proj-${Date.now()}`,
    title: projectData.title,
    category: projectData.category || 'ui-ux',
    category_label: projectData.category_label || projectData.categoryLabel || 'UI/UX Design',
    year: parseInt(projectData.year, 10) || new Date().getFullYear(),
    role: projectData.role || '',
    project_type: projectData.project_type || projectData.projectType || 'Case Study',
    summary: projectData.summary || '',
    cover_image: projectData.cover_image || projectData.coverImage || '',
    featured: projectData.featured !== undefined ? projectData.featured : true,
    published: projectData.published !== undefined ? projectData.published : true,
    tags: Array.isArray(projectData.tags) ? projectData.tags : [],
    updated_at: new Date().toISOString(),
  };

  let savedRow = {
    ...row,
    categoryLabel: row.category_label,
    projectType: row.project_type,
    coverImage: row.cover_image,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .upsert(row, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Supabase saveProject error:', error);
        return { data: null, error };
      }
      if (data) {
        savedRow = {
          ...data,
          categoryLabel: data.category_label || data.categoryLabel,
          projectType: data.project_type || data.projectType,
          coverImage: data.cover_image || data.coverImage,
        };
      }
    } catch (e) {
      console.error('Exception in saveProject:', e);
      return { data: null, error: e };
    }
  }

  // Update local storage
  try {
    const cached = localStorage.getItem('salporto_projects');
    const current = cached ? JSON.parse(cached) : mockProjects;
    const index = current.findIndex((p) => p.id === savedRow.id);
    let updated;
    if (index >= 0) {
      updated = [...current];
      updated[index] = savedRow;
    } else {
      updated = [savedRow, ...current];
    }
    localStorage.setItem('salporto_projects', JSON.stringify(updated));
  } catch (_) {}

  return { data: savedRow, error: null };
}

/**
 * Delete project from Supabase & localStorage
 */
export async function deleteProject(projectId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('projects').delete().eq('id', projectId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  try {
    const cached = localStorage.getItem('salporto_projects');
    const current = cached ? JSON.parse(cached) : mockProjects;
    const updated = current.filter((p) => p.id !== projectId);
    localStorage.setItem('salporto_projects', JSON.stringify(updated));
  } catch (_) {}

  return true;
}

/**
/**
 * Helper to get backup tools from localStorage
 */
function getLocalToolsBackup() {
  try {
    const raw = localStorage.getItem('salporto_exp_tools_backup');
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveLocalToolsBackup(id, tools) {
  try {
    const backup = getLocalToolsBackup();
    backup[id] = Array.isArray(tools) ? tools : [];
    localStorage.setItem('salporto_exp_tools_backup', JSON.stringify(backup));
  } catch (_) {}
}

/**
 * Fetch experiences from Supabase with multi-layered fallback for tools
 */
export async function getExperiences() {
  const toolsBackup = getLocalToolsBackup();

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const normalized = data.map((e) => {
          // 1. Try native column
          let tools = Array.isArray(e.tools) && e.tools.length > 0 ? e.tools : null;

          // 2. Try embedded metadata in description
          let cleanDescription = e.description || '';
          if (typeof e.description === 'string') {
            const match = e.description.match(/<!--TOOLS_META:(.*?)-->/s);
            if (match) {
              try {
                const parsed = JSON.parse(match[1]);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  tools = tools || parsed;
                }
              } catch (_) {}
            }
            cleanDescription = e.description.replace(/<!--TOOLS_META:.*?-->/s, '').trim();
          }

          // 3. Try local tools backup by ID
          if (!tools || tools.length === 0) {
            if (toolsBackup[e.id] && toolsBackup[e.id].length > 0) {
              tools = toolsBackup[e.id];
            }
          }

          // 4. Fallback to mock data for initial known items
          if (!tools || tools.length === 0) {
            const mock = mockExperiences.find(
              (m) => m.id === e.id || m.role?.toLowerCase() === e.role?.toLowerCase()
            );
            if (mock && Array.isArray(mock.tools) && mock.tools.length > 0) {
              tools = mock.tools;
            }
          }

          const finalTools = Array.isArray(tools) ? tools : [];
          if (finalTools.length > 0) {
            saveLocalToolsBackup(e.id, finalTools);
          }

          return {
            ...e,
            description: cleanDescription,
            isCurrent: e.is_current !== undefined ? e.is_current : e.isCurrent,
            sortOrder: e.sort_order ?? e.sortOrder,
            tools: finalTools,
          };
        });

        localStorage.setItem('salporto_experiences', JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Falling back to local experiences data:', err);
  }

  const cached = localStorage.getItem('salporto_experiences');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e) => {
          let tools = e.tools;
          if (!tools || tools.length === 0) {
            tools = toolsBackup[e.id] || mockExperiences.find((m) => m.id === e.id)?.tools || [];
          }
          return { ...e, tools };
        });
      }
    } catch (_) {}
  }

  return mockExperiences;
}

/**
 * Save / Update experience
 */
export async function saveExperience(expData) {
  const finalTools = Array.isArray(expData.tools) ? expData.tools : [];
  const toolsJson = JSON.stringify(finalTools);

  // Clean existing metadata comment from description, then embed tools metadata
  const baseDescription = (expData.description || '')
    .replace(/<!--TOOLS_META:.*?-->/s, '')
    .trim();
  const encodedDescription = `${baseDescription} <!--TOOLS_META:${toolsJson}-->`.trim();

  const row = {
    id: String(expData.id || `exp-${Date.now()}`),
    role: expData.role,
    organization: expData.organization,
    period: expData.period || '',
    type: expData.type || 'Internship',
    is_current: expData.is_current !== undefined ? expData.is_current : (expData.isCurrent ?? false),
    logo: expData.logo || '',
    jobdesk: Array.isArray(expData.jobdesk) ? expData.jobdesk : [],
    tools: finalTools,
    images: Array.isArray(expData.images) ? expData.images : [],
    description: encodedDescription,
    sort_order: parseInt(expData.sort_order ?? expData.sortOrder ?? 0, 10),
    updated_at: new Date().toISOString(),
  };

  // Keep backup in localStorage immediately
  saveLocalToolsBackup(row.id, finalTools);

  let savedRow = {
    ...row,
    description: baseDescription,
    isCurrent: row.is_current,
    sortOrder: row.sort_order,
    tools: finalTools,
  };

  if (isSupabaseConfigured()) {
    try {
      // 1. Try upsert with tools column
      let { data, error } = await supabase
        .from('experiences')
        .upsert(row, { onConflict: 'id' })
        .select()
        .single();

      // 2. If table doesn't have 'tools' column yet, retry with fallbackRow (description preserves the tools!)
      if (error && (error.message?.includes('tools') || error.code === '42703')) {
        const { tools, ...fallbackRow } = row;
        const retry = await supabase
          .from('experiences')
          .upsert(fallbackRow, { onConflict: 'id' })
          .select()
          .single();

        if (!retry.error) {
          error = null;
          data = { ...retry.data, tools: finalTools };
        }
      }

      if (error) {
        console.error('Supabase saveExperience error:', error);
        return { data: null, error };
      }

      if (data) {
        savedRow = {
          ...data,
          description: baseDescription,
          isCurrent: data.is_current !== undefined ? data.is_current : data.isCurrent,
          sortOrder: data.sort_order ?? data.sortOrder,
          tools: finalTools,
        };
      }
    } catch (e) {
      console.error('Exception in saveExperience:', e);
      return { data: null, error: e };
    }
  }

  try {
    const cached = localStorage.getItem('salporto_experiences');
    const current = cached ? JSON.parse(cached) : mockExperiences;
    const index = current.findIndex((e) => e.id === savedRow.id);
    let updated;
    if (index >= 0) {
      updated = [...current];
      updated[index] = savedRow;
    } else {
      updated = [...current, savedRow];
    }
    localStorage.setItem('salporto_experiences', JSON.stringify(updated));
  } catch (_) {}

  return { data: savedRow, error: null };
}

/**
 * Delete experience
 */
export async function deleteExperience(expId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('experiences').delete().eq('id', expId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  try {
    const cached = localStorage.getItem('salporto_experiences');
    const current = cached ? JSON.parse(cached) : mockExperiences;
    const updated = current.filter((e) => e.id !== expId);
    localStorage.setItem('salporto_experiences', JSON.stringify(updated));
  } catch (_) {}

  return true;
}
