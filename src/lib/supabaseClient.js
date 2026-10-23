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
        // Cache in localStorage for offline availability
        localStorage.setItem('salporto_projects', JSON.stringify(data));
        return data;
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
  let saved = projectData;

  // Sync to Supabase if available
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .upsert(projectData, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        saved = data;
      }
    } catch (e) {
      console.warn('Could not sync to Supabase table:', e);
    }
  }

  // Always update local storage
  const current = await getProjects();
  const index = current.findIndex((p) => p.id === saved.id);
  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = saved;
  } else {
    updated = [saved, ...current];
  }
  localStorage.setItem('salporto_projects', JSON.stringify(updated));

  return saved;
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

  const current = await getProjects();
  const updated = current.filter((p) => p.id !== projectId);
  localStorage.setItem('salporto_projects', JSON.stringify(updated));
  return true;
}

/**
 * Fetch experiences from Supabase with fallback
 */
export async function getExperiences() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        localStorage.setItem('salporto_experiences', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Falling back to local experiences data:', err);
  }

  const cached = localStorage.getItem('salporto_experiences');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {}
  }

  return mockExperiences;
}

/**
 * Save / Update experience
 */
export async function saveExperience(expData) {
  let saved = expData;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .upsert(expData, { onConflict: 'id' })
        .select()
        .single();

      if (!error && data) {
        saved = data;
      }
    } catch (e) {
      console.warn('Could not sync experience to Supabase table:', e);
    }
  }

  const current = await getExperiences();
  const index = current.findIndex((e) => e.id === saved.id);
  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = saved;
  } else {
    updated = [...current, saved];
  }
  localStorage.setItem('salporto_experiences', JSON.stringify(updated));

  return saved;
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

  const current = await getExperiences();
  const updated = current.filter((e) => e.id !== expId);
  localStorage.setItem('salporto_experiences', JSON.stringify(updated));
  return true;
}
