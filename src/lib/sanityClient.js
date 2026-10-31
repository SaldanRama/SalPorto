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
 * Convert Sanity image object or asset reference to an optimized CDN URL string
 * Automatically serves native resolution without downscaling.
 * @param {any} source
 * @param {{ width?: number, quality?: number, height?: number }} [options]
 * @returns {string|null}
 */
export function urlFor(source, options = {}) {
  if (!source) return null;

  const width = options.width;
  const quality = options.quality;

  // If source is already a direct string URL or path
  if (typeof source === 'string') {
    // If it's a local static path, return as is
    if (source.startsWith('/')) {
      return source;
    }

    // If it's a Sanity CDN URL string, preserve full native resolution
    if (source.includes('cdn.sanity.io/images/')) {
      try {
        const urlObj = new URL(source);
        if (width) {
          urlObj.searchParams.set('w', String(width));
        } else {
          urlObj.searchParams.delete('w');
        }
        if (quality) {
          urlObj.searchParams.set('q', String(quality));
        } else {
          urlObj.searchParams.delete('q');
        }
        // If no resize or quality constraint is specified, strip transforms to serve pure native original asset
        if (!width && !quality) {
          urlObj.searchParams.delete('auto');
          urlObj.searchParams.delete('w');
          urlObj.searchParams.delete('q');
          urlObj.searchParams.delete('fit');
        }
        return urlObj.toString();
      } catch (_) {
        return source;
      }
    }
    // If Unsplash, optimize dimensions & compression if requested
    if (source.includes('images.unsplash.com')) {
      try {
        const urlObj = new URL(source);
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('fit', 'crop');
        const currentW = parseInt(urlObj.searchParams.get('w') || '0', 10);
        if (width && (!currentW || currentW > width)) {
          urlObj.searchParams.set('w', String(width));
        }
        if (quality) {
          urlObj.searchParams.set('q', String(quality));
        }
        return urlObj.toString();
      } catch (_) {
        return source;
      }
    }
    return source;
  }

  // If source has an explicit url property
  if (source.url && typeof source.url === 'string') {
    return urlFor(source.url, options);
  }

  // If it's a valid Sanity image object or asset ref
  try {
    let imgBuilder = builder.image(source);
    if (width) {
      imgBuilder = imgBuilder.width(width);
    }
    if (quality) {
      imgBuilder = imgBuilder.quality(quality);
    }
    if (options.height) {
      imgBuilder = imgBuilder.height(options.height);
    }
    return imgBuilder.url();
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
    return ['/images/PusakaBugisLogo.webp', '/images/KemenbudLogo.webp'];
  }
  if (org.includes('unhas') || org.includes('laboratorium') || id.includes('lab')) {
    return '/images/UnhasLogo.webp';
  }
  if (org.includes('diskominfo') || id.includes('diskominfo')) {
    return '/images/KominfoLogo.webp';
  }
  if (org.includes('bpjs') || id.includes('bpjs')) {
    return '/images/BpjsLogo.webp';
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
        headline,
        slug,
        category,
        categoryLabel,
        year,
        role,
        projectType,
        summary,
        instagramUrl,
        coverImage,
        featured,
        tags,
        sortOrder,
        colorPalette,
        typography,
        softwareUsage,
        scopes,
        gallery,
        sections
      }`;

      const data = await sanityClient.fetch(query);

      if (data && data.length > 0) {
        const dummySlugs = new Set(['kelurahan-cantik', 'perdosfit', 'project-kelurahan-cantik', 'project-perdosfit', 'project-umkm-lakessi', 'umkm-lakessi']);
        const normalized = data
          .filter((p) => {
            const s = (p.slug?.current || p.slug || p._id || '').toLowerCase();
            return !dummySlugs.has(s);
          })
          .map((p) => {
            const coverUrl = urlFor(p.coverImage) || p.coverImage || '';
            const localMatch = mockProjects.find(
              (m) => m.slug === (p.slug?.current || p.slug) || m.id === p._id
            );
            return {
              ...(localMatch || {}),
              id: p._id,
              slug: p.slug?.current || p.slug || p._id,
              title: p.title || localMatch?.title,
              headline: p.headline || localMatch?.headline || '',
              category: p.category || localMatch?.category || 'ui-ux',
              categoryLabel: p.categoryLabel || localMatch?.categoryLabel || 'UI/UX Design',
              year: p.year || localMatch?.year || new Date().getFullYear(),
              role: p.role || localMatch?.role || '',
              projectType: p.projectType || localMatch?.projectType || 'Case Study',
              summary: p.summary || localMatch?.summary || '',
              instagramUrl: p.instagramUrl || localMatch?.instagramUrl || '',
              coverImage: coverUrl || localMatch?.coverImage || '',
              cover_image: coverUrl || localMatch?.coverImage || '',
              featured: p.featured ?? localMatch?.featured ?? true,
              tools: Array.isArray(p.tools) && p.tools.length > 0 ? p.tools : (localMatch?.tools || []),
              tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : (localMatch?.tags || []),
              colorPalette: Array.isArray(p.colorPalette) && p.colorPalette.length > 0 ? p.colorPalette : (localMatch?.colorPalette || []),
              typography: Array.isArray(p.typography) && p.typography.length > 0 ? p.typography : (localMatch?.typography || []),
              softwareUsage: Array.isArray(p.softwareUsage) && p.softwareUsage.length > 0 ? p.softwareUsage : (localMatch?.softwareUsage || []),
              scopes: Array.isArray(p.scopes) && p.scopes.length > 0 ? p.scopes : (localMatch?.scopes || []),
              gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : (localMatch?.gallery || []),
              sections: Array.isArray(p.sections) && p.sections.length > 0 ? p.sections : (localMatch?.sections || []),
              sortOrder: p.sortOrder ?? localMatch?.sortOrder ?? 0,
            };
          });

        try {
          localStorage.removeItem('salporto_projects_v3');
          localStorage.removeItem('salporto_projects_v4');
          localStorage.removeItem('salporto_projects_v5');
          localStorage.setItem('salporto_projects_v6', JSON.stringify(normalized));
        } catch (_) {}

        return normalized.length > 0 ? normalized : mockProjects;
      }
    }
  } catch (err) {
    console.warn('Sanity getProjects error, falling back to local cache:', err);
  }

  // Fallback to localStorage or mockProjects
  try {
    localStorage.removeItem('salporto_projects_v3');
    localStorage.removeItem('salporto_projects_v4');
    localStorage.removeItem('salporto_projects_v5');
    const cached = localStorage.getItem('salporto_projects_v6');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const dummySlugs = new Set(['kelurahan-cantik', 'perdosfit', 'project-kelurahan-cantik', 'project-perdosfit', 'project-umkm-lakessi', 'umkm-lakessi']);
        const clean = parsed.filter((p) => !dummySlugs.has((p.slug || p.id || '').toLowerCase()));
        if (clean.length > 0) return clean;
      }
    }
  } catch (_) {}

  return mockProjects;
}

/**
 * Fetch single project by slug from Sanity
 */
export async function getProjectBySlug(slug) {
  const normalizedSlug = slug === 'umkm-lakessi' ? 'lakessi' : slug;
  const localMatch = mockProjects.find(
    (p) =>
      p.slug === slug ||
      p.slug === normalizedSlug ||
      p.id === slug ||
      p.id === normalizedSlug ||
      (slug === 'lakessi' && (p.slug === 'lakessi' || p.id === 'lakessi'))
  );

  try {
    if (isSanityConfigured()) {
      const query = `*[_type == "project" && (slug.current == $slug || slug.current == $altSlug || _id == $slug)][0] {
        _id,
        title,
        headline,
        slug,
        category,
        categoryLabel,
        year,
        role,
        projectType,
        summary,
        instagramUrl,
        coverImage,
        featured,
        tags,
        sortOrder,
        colorPalette,
        typography,
        softwareUsage,
        scopes,
        gallery,
        sections
      }`;

      const doc = await sanityClient.fetch(query, { slug, altSlug: normalizedSlug });
      if (doc) {
        const coverUrl = urlFor(doc.coverImage) || doc.coverImage || localMatch?.coverImage || '';
        return {
          ...(localMatch || {}),
          ...doc,
          id: doc._id,
          slug: doc.slug?.current || doc.slug || doc._id,
          title: doc.title || localMatch?.title,
          headline: doc.headline || localMatch?.headline || '',
          category: doc.category || localMatch?.category || 'ui-ux',
          categoryLabel: doc.categoryLabel || localMatch?.categoryLabel || 'UI/UX Design',
          year: doc.year || localMatch?.year || new Date().getFullYear(),
          role: doc.role || localMatch?.role || '',
          projectType: doc.projectType || localMatch?.projectType || 'Case Study',
          summary: doc.summary || localMatch?.summary || '',
          instagramUrl: doc.instagramUrl || localMatch?.instagramUrl || '',
          coverImage: coverUrl,
          cover_image: coverUrl,
          featured: doc.featured ?? localMatch?.featured ?? true,
          tags: Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags : (localMatch?.tags || []),
          colorPalette: Array.isArray(doc.colorPalette) && doc.colorPalette.length > 0 ? doc.colorPalette : (localMatch?.colorPalette || []),
          typography: Array.isArray(doc.typography) && doc.typography.length > 0 ? doc.typography : (localMatch?.typography || []),
          softwareUsage: Array.isArray(doc.softwareUsage) && doc.softwareUsage.length > 0 ? doc.softwareUsage : (localMatch?.softwareUsage || []),
          scopes: Array.isArray(doc.scopes) && doc.scopes.length > 0 ? doc.scopes : (localMatch?.scopes || []),
          gallery: Array.isArray(doc.gallery) && doc.gallery.length > 0 ? doc.gallery : (localMatch?.gallery || []),
          sections: Array.isArray(doc.sections) && doc.sections.length > 0 ? doc.sections : (localMatch?.sections || []),
          sortOrder: doc.sortOrder ?? localMatch?.sortOrder ?? 0,
        };
      }
    }
  } catch (err) {
    console.warn(`Sanity getProjectBySlug('${slug}') error:`, err);
  }

  // Fallback to local data
  if (localMatch) return localMatch;
  const all = await getProjects();
  return (
    all.find(
      (p) =>
        p.slug === slug ||
        p.slug === normalizedSlug ||
        p.id === slug ||
        p.id === normalizedSlug ||
        (slug === 'lakessi' && p.id === 'umkm-lakessi')
    ) || null
  );
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
 * Image pass-through: preserves 100% original, native file resolution & format
 * without any client-side canvas resizing or lossy compression.
 */
export async function compressImageBeforeUpload(file) {
  // Always return the pure native original file as-is
  return file;
}

/**
 * Upload an image file (File or Blob) directly to Sanity Assets pipeline
 * Preserves 100% original native resolution, format, and pixel quality.
 */
export async function uploadImageToSanity(file, filename) {
  try {
    if (!file) return { error: new Error('No file provided') };

    // Upload raw original file directly to Sanity Assets Lake without any canvas downscaling
    const asset = await sanityWriteClient.assets.upload('image', file, {
      filename: filename || file.name || 'image',
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

    let categoryLabel = project.categoryLabel;
    if (!categoryLabel) {
      if (project.category === 'graphic-design') categoryLabel = 'Graphic Design & Visual Identity';
      else if (project.category === 'web') categoryLabel = 'Web Projects';
      else categoryLabel = 'UI/UX Design';
    }

    const doc = {
      _id: docId,
      _type: 'project',
      title: project.title,
      headline: project.headline || '',
      slug: { _type: 'slug', current: slugVal },
      category: project.category || 'graphic-design',
      categoryLabel,
      year: Number(project.year) || new Date().getFullYear(),
      role: project.role || '',
      projectType: project.projectType || 'Case Study',
      summary: project.summary || '',
      instagramUrl: project.instagramUrl || '',
      coverImage: project.coverImage || project.cover_image || '',
      featured: Boolean(project.featured ?? true),
      published: Boolean(project.published ?? true),
      tools: Array.isArray(project.tools) ? project.tools : (Array.isArray(project.tags) ? project.tags : []),
      tags: Array.isArray(project.tags) ? project.tags : (Array.isArray(project.tools) ? project.tools : []),
      scopes: Array.isArray(project.scopes) ? project.scopes : [],
      sortOrder: Number(project.sortOrder ?? 0),
    };

    if (Array.isArray(project.gallery)) {
      doc.gallery = project.gallery
        .filter((g) => g && (g.src || g.title || g.url))
        .map((item, idx) => ({
          _key: item._key || item.id || `slide-${Date.now()}-${idx}`,
          id: item.id || `slide-${idx + 1}`,
          title: item.title || '',
          category: item.category || '',
          caption: item.caption || '',
          src: item.src || item.url || '',
        }));
    } else {
      doc.gallery = [];
    }

    if (Array.isArray(project.colorPalette)) {
      doc.colorPalette = project.colorPalette;
    }
    if (Array.isArray(project.typography)) {
      doc.typography = project.typography;
    }

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
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75',
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
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=75',
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
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=75',
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
      url: '/images/projects/Lakessi/1.png',
      linkUrl: '/work/lakessi',
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


