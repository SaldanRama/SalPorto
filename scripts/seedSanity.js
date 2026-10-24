import { createClient } from '@sanity/client';
import { mockProjects, mockExperiences } from '../src/data/mockData.js';

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'wt1wcbf0';
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN || process.env.VITE_SANITY_WRITE_TOKEN;

if (!token) {
  console.log('---------------------------------------------------------');
  console.log('INFO: SANITY_AUTH_TOKEN tidak ditemukan.');
  console.log('Untuk seeding otomatis via command line:');
  console.log('1. Buka https://www.sanity.io/manage');
  console.log('2. Pilih project -> API -> Tokens -> Add API token (Role: Editor)');
  console.log('3. Jalankan:');
  console.log('   $env:SANITY_AUTH_TOKEN="token_anda"; node scripts/seedSanity.js');
  console.log('Atau cukup input & kelola konten langsung lewat Sanity Studio di /admin');
  console.log('---------------------------------------------------------');
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-24',
  token,
  useCdn: false,
});

async function seed() {
  console.log(`Mengirim data mock ke Sanity Project: ${projectId} (Dataset: ${dataset})...`);

  // 1. Seed Projects
  for (let i = 0; i < mockProjects.length; i++) {
    const p = mockProjects[i];
    const doc = {
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      categoryLabel: p.categoryLabel,
      year: p.year,
      role: p.role,
      projectType: p.projectType,
      summary: p.summary,
      featured: true,
      published: true,
      tags: p.tags,
      sortOrder: i,
    };
    await client.createOrReplace(doc);
    console.log(`✓ Project ditambahkan: ${p.title}`);
  }

  // 2. Seed Experiences
  for (let i = 0; i < mockExperiences.length; i++) {
    const exp = mockExperiences[i];
    const doc = {
      _id: `experience-${exp.id}`,
      _type: 'experience',
      role: exp.role,
      organization: exp.organization,
      period: exp.period,
      type: exp.type,
      isCurrent: exp.isCurrent,
      sortOrder: exp.sortOrder ?? i,
      jobdesk: exp.jobdesk,
      tools: exp.tools,
      description: exp.description,
    };
    await client.createOrReplace(doc);
    console.log(`✓ Experience ditambahkan: ${exp.role} di ${exp.organization}`);
  }

  console.log('Semua data awal berhasil dimigrasikan ke Sanity!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
