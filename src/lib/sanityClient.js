import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { mockProjects, mockExperiences } from '@/data/mockData';

// Sanity Project Credentials
export const projectId =
  import.meta.env.VITE_SANITY_PROJECT_ID ||
  import.meta.env.SANITY_PROJECT_ID ||
  'wt1wcbf0';

export const dataset =
  import.meta.env.VITE_SANITY_DATASET ||
  import.meta.env.SANITY_DATASET ||
  'production';

export const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION ||
  import.meta.env.SANITY_API_VERSION ||
  '2024-10-24';

export const isSanityConfigured = () => {
  return Boolean(projectId && dataset && projectId !== 'your-project-id');
};

// Initialize Read Client (real-time live content)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

// Initialize Image URL Builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Convert Sanity image object or asset reference to a CDN URL string
 * @param {any} source
 * @returns {string|null}
 */
export function urlFor(source) {
  if (!source) return null;

  // If source is already a direct string URL or path
  if (typeof source === 'string') {
    return source;
  }

  // If source has an explicit url property
  if (source.url && typeof source.url === 'string') {
    return source.url;
  }

  // If it's a valid Sanity image object or asset ref
  try {
    return builder.image(source).auto('format').fit('max').url();
  } catch (err) {
    console.warn('Could not build Sanity image URL:', err);
    return null;
  }
}

/**
 * Helper to resolve experience logos with Sanity image builder & brand fallbacks
 */
export function resolveExperienceLogo(e) {
  // 1. Check if experience has Sanity logos array
  if (Array.isArray(e?.logos) && e.logos.length > 0) {
    const urls = e.logos
      .map((l) => (typeof l === 'string' ? l : urlFor(l)))
      .filter(Boolean);
    if (urls.length > 0) return urls;
  }

  // 2. Check legacy logo property
  if (e?.logo) {
    if (Array.isArray(e.logo) && e.logo.length > 0) {
      const urls = e.logo
        .map((l) => (typeof l === 'string' ? l : urlFor(l)))
        .filter(Boolean);
      if (urls.length > 0) return urls;
    }
    if (typeof e.logo === 'string' && e.logo.trim() !== '') {
      const trimmed = e.logo.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
      if (trimmed.includes(',')) {
        return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return trimmed;
    }
  }

  // 3. Fallback based on institution name keywords
  const org = (e?.organization || '').toLowerCase();
  const role = (e?.role || '').toLowerCase();
  const id = (e?.id || '').toLowerCase();

  if (
    org.includes('pusaka') ||
    org.includes('kemenbud') ||
    role.includes('pusaka') ||
    id.includes('pusaka')
  ) {
    return ['/images/PusakaBugisLogo.png', '/images/KemenbudLogo.png'];
  }
  if (org.includes('unhas') || org.includes('laboratorium') || id.includes('lab')) {
    return '/images/UnhasLogo.png';
  }
  if (org.includes('diskominfo') || id.includes('diskominfo')) {
    return '/images/KominfoLogo.png';
  }
  if (org.includes('bpjs') || id.includes('bpjs')) {
    return '/images/BpjsLogo.png';
  }

  return '';
}

/**
 * Fetch projects from Sanity Content Lake with fallback to localStorage & mockProjects
 */
export async function getProjects() {
  try {
    if (isSanityConfigured()) {
      const query = `*[_type == "project" && published != false] | order(sortOrder asc, year desc) {
        _id,
        title,
        slug,
        category,
        categoryLabel,
        year,
        role,
        projectType,
        summary,
        coverImage,
        featured,
        tags,
        sortOrder
      }`;

      const data = await sanityClient.fetch(query);

      if (data && data.length > 0) {
        const normalized = data.map((p) => {
          const coverUrl = urlFor(p.coverImage) || p.coverImage || '';
          return {
            id: p._id,
            slug: p.slug?.current || p.slug || p._id,
            title: p.title,
            category: p.category || 'ui-ux',
            categoryLabel: p.categoryLabel || 'UI/UX Design',
            year: p.year || new Date().getFullYear(),
            role: p.role || '',
            projectType: p.projectType || 'Case Study',
            summary: p.summary || '',
            coverImage: coverUrl,
            cover_image: coverUrl,
            featured: p.featured ?? true,
            tags: Array.isArray(p.tags) ? p.tags : [],
            sortOrder: p.sortOrder ?? 0,
          };
        });

        try {
          localStorage.setItem('salporto_projects', JSON.stringify(normalized));
        } catch (_) {}

        return normalized;
      }
    }
  } catch (err) {
    console.warn('Sanity getProjects error, falling back to local cache:', err);
  }

  // Fallback to localStorage or mockProjects
  try {
    const cached = localStorage.getItem('salporto_projects');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  return mockProjects;
}

/**
 * Fetch single project by slug from Sanity
 */
export async function getProjectBySlug(slug) {
  try {
    if (isSanityConfigured()) {
      const query = `*[_type == "project" && (slug.current == $slug || _id == $slug)][0] {
        _id,
        title,
        slug,
        category,
        categoryLabel,
        year,
        role,
        projectType,
        summary,
        coverImage,
        featured,
        tags,
        sortOrder
      }`;

      const doc = await sanityClient.fetch(query, { slug });
      if (doc) {
        const coverUrl = urlFor(doc.coverImage) || doc.coverImage || '';
        return {
          id: doc._id,
          slug: doc.slug?.current || doc.slug || doc._id,
          title: doc.title,
          category: doc.category || 'ui-ux',
          categoryLabel: doc.categoryLabel || 'UI/UX Design',
          year: doc.year || new Date().getFullYear(),
          role: doc.role || '',
          projectType: doc.projectType || 'Case Study',
          summary: doc.summary || '',
          coverImage: coverUrl,
          cover_image: coverUrl,
          featured: doc.featured ?? true,
          tags: Array.isArray(doc.tags) ? doc.tags : [],
          sortOrder: doc.sortOrder ?? 0,
        };
      }
    }
  } catch (err) {
    console.warn(`Sanity getProjectBySlug('${slug}') error:`, err);
  }

  // Fallback to local data
  const all = await getProjects();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
}

/**
 * Fetch experiences from Sanity with rich image mapping & fallback
 */
export async function getExperiences() {
  try {
    if (isSanityConfigured()) {
      const query = `*[_type == "experience"] | order(sortOrder asc) {
        _id,
        role,
        organization,
        period,
        type,
        isCurrent,
        sortOrder,
        logos,
        jobdesk,
        tools,
        images,
        description
      }`;

      const data = await sanityClient.fetch(query);

      if (data && data.length > 0) {
        const normalized = data.map((e) => {
          // Resolve logos
          const resolvedLogo = resolveExperienceLogo(e);

          // Resolve photo images stack
          const resolvedImages = Array.isArray(e.images)
            ? e.images.map((imgItem) => {
                const photoFile = imgItem.image || imgItem;
                const photoUrl = urlFor(photoFile) || imgItem.url || '';
                return {
                  url: photoUrl,
                  title: imgItem.title || '',
                  caption: imgItem.caption || '',
                };
              })
            : [];

          return {
            id: e._id,
            role: e.role,
            organization: e.organization,
            period: e.period || '',
            type: e.type || 'Internship',
            isCurrent: e.isCurrent ?? false,
            is_current: e.isCurrent ?? false,
            sortOrder: e.sortOrder ?? 0,
            sort_order: e.sortOrder ?? 0,
            logo: resolvedLogo,
            logos: resolvedLogo,
            jobdesk: Array.isArray(e.jobdesk) ? e.jobdesk : [],
            tools: Array.isArray(e.tools) ? e.tools : [],
            images: resolvedImages,
            description: e.description || '',
          };
        });

        try {
          localStorage.setItem('salporto_experiences', JSON.stringify(normalized));
        } catch (_) {}

        return normalized;
      }
    }
  } catch (err) {
    console.warn('Sanity getExperiences error, falling back to local cache:', err);
  }

  // Fallback to localStorage or mockExperiences
  try {
    const cached = localStorage.getItem('salporto_experiences');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e) => ({
          ...e,
          logo: resolveExperienceLogo(e),
        }));
      }
    }
  } catch (_) {}

  return mockExperiences.map((m) => ({
    ...m,
    logo: resolveExperienceLogo(m),
  }));
}

export const writeToken =
  import.meta.env.VITE_SANITY_WRITE_TOKEN ||
  'skGGzNf2QNqiJsJdcxsD6ApBNhxPa4EYA8eJHowJ67A1ewdAFmqyGY7d4vCrGHIih8umVpk0ipIX7ftNoUBHuh6KlOI1EZEuc95QkVwqYE1rqsJ4l1mpdr79cnezLGVOv3kt00sWDuUgZCQQQrL4Op0Is4mtvnLHagluQd6df7coF1S5PIyB';

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
});

/**
 * Upload an image file (File or Blob) to Sanity Assets pipeline
 */
export async function uploadImageToSanity(file, filename) {
  try {
    const asset = await sanityWriteClient.assets.upload('image', file, {
      filename: filename || file.name,
    });
    return {
      asset,
      url: asset.url,
      _id: asset._id,
    };
  } catch (err) {
    console.error('uploadImageToSanity error:', err);
    return { error: err };
  }
}

/**
 * Create or Update Experience in Sanity Lake
 */
export async function saveExperience(exp) {
  try {
    const docId = exp.id || exp._id || `exp-${Date.now()}`;
    const doc = {
      _id: docId,
      _type: 'experience',
      role: exp.role,
      organization: exp.organization,
      period: exp.period || '',
      type: exp.type || 'Internship',
      isCurrent: Boolean(exp.isCurrent ?? exp.is_current),
      sortOrder: Number(exp.sortOrder ?? exp.sort_order ?? 0),
      description: exp.description || '',
      jobdesk: Array.isArray(exp.jobdesk) ? exp.jobdesk.filter(Boolean) : [],
      tools: Array.isArray(exp.tools) ? exp.tools : [],
    };

    if (Array.isArray(exp.images) && exp.images.length > 0) {
      doc.images = exp.images.map((img, i) => {
        const assetRef = img._id || img.assetId || img.asset?._ref || img.image?.asset?._ref;
        return {
          _key: img._key || `img-${Date.now()}-${i}`,
          title: img.title || '',
          caption: img.caption || '',
          ...(assetRef
            ? {
                image: {
                  _type: 'image',
                  asset: { _type: 'reference', _ref: assetRef },
                },
              }
            : img.image
            ? { image: img.image }
            : {}),
        };
      });
    }

    if (exp.logoAssetId) {
      doc.logos = [
        {
          _key: `logo-${Date.now()}`,
          _type: 'image',
          asset: { _type: 'reference', _ref: exp.logoAssetId },
        },
      ];
    } else if (Array.isArray(exp.logos) && exp.logos.length > 0) {
      doc.logos = exp.logos;
    }

    const result = await sanityWriteClient.createOrReplace(doc);
    return { data: result, error: null };
  } catch (err) {
    console.error('saveExperience error:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete Experience from Sanity Lake
 */
export async function deleteExperience(id) {
  try {
    const res = await sanityWriteClient.delete(id);
    return { data: res, error: null };
  } catch (err) {
    console.error('deleteExperience error:', err);
    return { data: null, error: err };
  }
}

/**
 * Create or Update Project in Sanity Lake
 */
export async function saveProject(project) {
  try {
    const docId = project.id || project._id || `project-${Date.now()}`;
    const slugVal =
      project.slug ||
      project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const doc = {
      _id: docId,
      _type: 'project',
      title: project.title,
      slug: { _type: 'slug', current: slugVal },
      category: project.category || 'ui-ux',
      categoryLabel: project.categoryLabel || 'UI/UX Design',
      year: Number(project.year) || new Date().getFullYear(),
      role: project.role || '',
      projectType: project.projectType || 'Case Study',
      summary: project.summary || '',
      featured: Boolean(project.featured ?? true),
      published: Boolean(project.published ?? true),
      tags: Array.isArray(project.tags) ? project.tags : [],
      sortOrder: Number(project.sortOrder ?? 0),
    };

    const result = await sanityWriteClient.createOrReplace(doc);
    return { data: result, error: null };
  } catch (err) {
    console.error('saveProject error:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete Project from Sanity Lake
 */
export async function deleteProject(id) {
  try {
    const res = await sanityWriteClient.delete(id);
    return { data: res, error: null };
  } catch (err) {
    console.error('deleteProject error:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch Mini Gallery items from Sanity Lake with 16:9 aspect ratio resolution
 */
export async function getMiniGallery() {
  try {
    if (isSanityConfigured()) {
      const query = `*[_type == "miniGallery"] | order(sortOrder asc, _createdAt desc) {
        _id,
        title,
        caption,
        image,
        linkUrl,
        sortOrder,
        published,
        _createdAt
      }`;
      const data = await sanityClient.fetch(query);
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((item, index) => {
          const imgUrl = urlFor(item.image) || item.image?.url || '';
          return {
            id: item._id,
            _id: item._id,
            title: item.title || `Project Slide #${index + 1}`,
            caption: item.caption || '',
            url: imgUrl,
            image: item.image,
            linkUrl: item.linkUrl || '',
            sortOrder: Number(item.sortOrder ?? index),
            published: item.published ?? true,
          };
        });

        try {
          localStorage.setItem('salporto_minigallery', JSON.stringify(normalized));
        } catch (_) {}

        return normalized;
      }
    }
  } catch (err) {
    console.warn('Sanity getMiniGallery error, falling back:', err);
  }

  // Fallback to localStorage or mock items
  try {
    const cached = localStorage.getItem('salporto_minigallery');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  // High quality default initial items so the carousel is never empty before user uploads
  return [
    {
      id: 'default-cover-1',
      _id: 'default-cover-1',
      title: 'SIMRS RSUD Hasanuddin Web App',
      caption: 'UI/UX Redesign & Healthcare Management Dashboard',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '#',
      sortOrder: 0,
      published: true,
      isDefault: true,
    },
    {
      id: 'default-cover-2',
      _id: 'default-cover-2',
      title: 'PerdosFit — Gym Management Concept',
      caption: 'Double Diamond Methodology & Interactive Prototype',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '/work/perdosfit',
      sortOrder: 1,
      published: true,
      isDefault: true,
    },
    {
      id: 'default-cover-3',
      _id: 'default-cover-3',
      title: 'Diskominfo Makassar — Kelurahan Cantik',
      caption: 'Community Statistical Web System & Visual Identity',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '/work/kelurahan-cantik',
      sortOrder: 2,
      published: true,
      isDefault: true,
    },
    {
      id: 'default-cover-4',
      _id: 'default-cover-4',
      title: 'UMKM Lakessi Brand Identity',
      caption: 'Creative Packaging, Typography & Brand Guidelines',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '#',
      sortOrder: 3,
      published: true,
      isDefault: true,
    },
  ];
}

/**
 * Save Mini Gallery item to Sanity Lake
 */
export async function saveMiniGalleryItem(item) {
  try {
    const docId = item.id || item._id || `gallery-${Date.now()}`;
    const doc = {
      _id: docId,
      _type: 'miniGallery',
      title: item.title,
      caption: item.caption || '',
      linkUrl: item.linkUrl || '',
      sortOrder: Number(item.sortOrder ?? 0),
      published: Boolean(item.published ?? true),
    };

    if (item.assetId || item.asset?._ref || item.image?.asset?._ref) {
      const assetRef = item.assetId || item.asset?._ref || item.image?.asset?._ref;
      doc.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetRef,
        },
      };
    } else if (item.image) {
      doc.image = item.image;
    }

    const result = await sanityWriteClient.createOrReplace(doc);
    return { data: result, error: null };
  } catch (err) {
    console.error('saveMiniGalleryItem error:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete Mini Gallery item from Sanity Lake
 */
export async function deleteMiniGalleryItem(id) {
  try {
    const res = await sanityWriteClient.delete(id);
    return { data: res, error: null };
  } catch (err) {
    console.error('deleteMiniGalleryItem error:', err);
    return { data: null, error: err };
  }
}


