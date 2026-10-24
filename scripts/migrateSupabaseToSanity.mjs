import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'wt1wcbf0';
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.VITE_SANITY_WRITE_TOKEN ||
  'skGGzNf2QNqiJsJdcxsD6ApBNhxPa4EYA8eJHowJ67A1ewdAFmqyGY7d4vCrGHIih8umVpk0ipIX7ftNoUBHuh6KlOI1EZEuc95QkVwqYE1rqsJ4l1mpdr79cnezLGVOv3kt00sWDuUgZCQQQrL4Op0Is4mtvnLHagluQd6df7coF1S5PIyB';

const supabaseUrl = 'https://qarvsujzxunsyktofquu.supabase.co';
const supabaseKey = 'sb_publishable_Wux1sgLxGOKDuue1wKCB3Q_xQNFMsQ8';

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-24',
  token,
  useCdn: false,
});

async function fetchSupabaseTable(table) {
  const url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch ${table}: ${res.status} ${text}`);
  }
  return await res.json();
}

/**
 * Upload an image (from URL or local public path) to Sanity Asset Pipeline
 */
async function uploadToSanity(source) {
  if (!source) return null;

  try {
    // 1. If it's a remote URL (e.g. from Supabase Storage)
    if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
      const res = await fetch(source);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = path.basename(new URL(source).pathname) || 'image.jpg';
      const asset = await sanity.assets.upload('image', buffer, { filename });
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      };
    }

    // 2. If it's a local public path (e.g. /images/perdosfit-cover.webp)
    if (typeof source === 'string' && source.startsWith('/images/')) {
      const localFilePath = path.join(process.cwd(), 'public', source);
      if (fs.existsSync(localFilePath)) {
        const stream = fs.createReadStream(localFilePath);
        const filename = path.basename(localFilePath);
        const asset = await sanity.assets.upload('image', stream, { filename });
        return {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        };
      }
    }
  } catch (err) {
    console.warn(`Could not upload asset (${source}):`, err.message);
  }

  return null;
}

async function migrate() {
  console.log('====================================================');
  console.log(`Memulai migrasi data Supabase -> Sanity (${projectId}/${dataset})`);
  console.log('====================================================');

  // 1. Migrasi Projects
  const supabaseProjects = await fetchSupabaseTable('projects');
  console.log(`\nMenemukan ${supabaseProjects.length} Projects di Supabase...`);

  for (const p of supabaseProjects) {
    console.log(`\nProcessing Project: ${p.title} (${p.slug})...`);
    let coverAsset = null;
    const coverUrl = p.cover_image || p.coverImage;
    if (coverUrl) {
      coverAsset = await uploadToSanity(coverUrl);
    }

    const doc = {
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category || 'ui-ux',
      categoryLabel: p.category_label || p.categoryLabel || 'UI/UX Design',
      year: parseInt(p.year, 10) || new Date().getFullYear(),
      role: p.role || '',
      projectType: p.project_type || p.projectType || 'Case Study',
      summary: p.summary || '',
      featured: p.featured ?? true,
      published: p.published ?? true,
      tags: Array.isArray(p.tags) ? p.tags : [],
      sortOrder: p.sort_order ?? p.sortOrder ?? 0,
      ...(coverAsset ? { coverImage: coverAsset } : {}),
    };

    await sanity.createOrReplace(doc);
    console.log(`✓ Project tersimpan di Sanity: ${p.title}`);
  }

  // 2. Migrasi Experiences
  const supabaseExperiences = await fetchSupabaseTable('experiences');
  console.log(`\nMenemukan ${supabaseExperiences.length} Experiences di Supabase...`);

  // Sort by sort_order
  supabaseExperiences.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  for (let i = 0; i < supabaseExperiences.length; i++) {
    const e = supabaseExperiences[i];
    console.log(`\n[${i + 1}/${supabaseExperiences.length}] Processing Experience: ${e.role} @ ${e.organization}...`);

    // Extract tools from description if embedded
    let tools = Array.isArray(e.tools) && e.tools.length > 0 ? e.tools : [];
    let cleanDescription = e.description || '';
    if (typeof e.description === 'string') {
      const match = e.description.match(/<!--TOOLS_META:(.*?)-->/s);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            tools = parsed;
          }
        } catch (_) {}
      }
      cleanDescription = e.description.replace(/<!--TOOLS_META:.*?-->/s, '').trim();
    }

    // Upload logos to Sanity
    const uploadedLogos = [];
    if (e.logo) {
      let logoList = [];
      if (Array.isArray(e.logo)) {
        logoList = e.logo;
      } else if (typeof e.logo === 'string') {
        const trimmed = e.logo.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            logoList = JSON.parse(trimmed);
          } catch (_) {}
        } else if (trimmed.includes(',')) {
          logoList = trimmed.split(',').map((s) => s.trim());
        } else if (trimmed !== '') {
          logoList = [trimmed];
        }
      }

      for (const l of logoList) {
        const asset = await uploadToSanity(l);
        if (asset) uploadedLogos.push(asset);
      }
    }

    // Fallback logo upload for known institutions if no logo yet
    if (uploadedLogos.length === 0) {
      const org = (e.organization || '').toLowerCase();
      if (org.includes('pusaka') || org.includes('kemenbud')) {
        const l1 = await uploadToSanity('/images/PusakaBugisLogo.png');
        const l2 = await uploadToSanity('/images/KemenbudLogo.png');
        if (l1) uploadedLogos.push(l1);
        if (l2) uploadedLogos.push(l2);
      } else if (org.includes('unhas') || org.includes('laboratorium')) {
        const l = await uploadToSanity('/images/UnhasLogo.png');
        if (l) uploadedLogos.push(l);
      } else if (org.includes('diskominfo')) {
        const l = await uploadToSanity('/images/KominfoLogo.png');
        if (l) uploadedLogos.push(l);
      } else if (org.includes('bpjs')) {
        const l = await uploadToSanity('/images/BpjsLogo.png');
        if (l) uploadedLogos.push(l);
      }
    }

    // Upload documentation photos to Sanity
    const uploadedImages = [];
    if (Array.isArray(e.images) && e.images.length > 0) {
      for (let j = 0; j < e.images.length; j++) {
        const imgObj = e.images[j];
        const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.url;
        if (imgUrl) {
          const asset = await uploadToSanity(imgUrl);
          if (asset) {
            uploadedImages.push({
              _key: `img_${Date.now()}_${j}`,
              image: asset,
              title: imgObj.title || '',
              caption: imgObj.caption || '',
            });
          }
        }
      }
    }

    const docId = `exp-${(e.id || `${i}`).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const doc = {
      _id: docId,
      _type: 'experience',
      role: e.role,
      organization: e.organization,
      period: e.period || '',
      type: e.type || 'Internship',
      isCurrent: e.is_current ?? e.isCurrent ?? false,
      sortOrder: e.sort_order ?? e.sortOrder ?? i,
      jobdesk: Array.isArray(e.jobdesk) ? e.jobdesk : [],
      tools: Array.isArray(tools) ? tools : [],
      description: cleanDescription,
      ...(uploadedLogos.length > 0 ? { logos: uploadedLogos } : {}),
      ...(uploadedImages.length > 0 ? { images: uploadedImages } : {}),
    };

    await sanity.createOrReplace(doc);
    console.log(`✓ Experience tersimpan di Sanity: ${e.role} @ ${e.organization} (${uploadedImages.length} foto)`);
  }

  console.log('\n====================================================');
  console.log('MIGRASI LENGKAP SELESAI!');
  console.log(`Semua ${supabaseProjects.length} project dan ${supabaseExperiences.length} experience telah sukses dipindahkan ke Sanity!`);
  console.log('====================================================');
}

migrate().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
