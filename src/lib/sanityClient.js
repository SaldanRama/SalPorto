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

// Initialize Read Client (with CDN enabled for fast edge delivery)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
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
