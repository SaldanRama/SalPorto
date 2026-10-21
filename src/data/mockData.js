/**
 * Temporary mock data adhering strictly to CONTEXT.md and BLUEPRINT.md.
 * Easily swappable when Supabase database integration is connected in subsequent phases.
 */

export const mockProjects = [
  {
    id: 'perdosfit',
    slug: 'perdosfit',
    title: 'PerdosFit',
    category: 'ui-ux',
    categoryLabel: 'UI/UX Design',
    year: 2024,
    role: 'UI/UX Designer',
    projectType: 'Academic / Conceptual Case Study',
    summary:
      'A Gym Management System web concept built using the Double Diamond methodology, tailored for Admin, Personal Trainer, and Member roles.',
    coverImage: '/images/perdosfit-cover.webp',
    featured: true,
    tags: ['UI/UX', 'Double Diamond', 'Figma', 'System Design'],
  },
  {
    id: 'kelurahan-cantik',
    slug: 'kelurahan-cantik',
    title: 'Website Kelurahan Cantik',
    category: 'web',
    categoryLabel: 'Web / UI/UX',
    year: 2024,
    role: 'UI/UX Designer & Front-End Contributor',
    projectType: 'Government / Diskominfo Makassar',
    summary:
      'Community statistical website initiative developed with Diskominfo Makassar to present administrative village data clearly and transparently.',
    coverImage: '/images/kelurahan-cantik-cover.webp',
    featured: true,
    tags: ['UI/UX', 'Front-End', 'Public Service', 'Design System'],
  },
  {
    id: 'umkm-lakessi',
    slug: 'umkm-lakessi',
    title: 'UMKM Lakessi Visual Branding',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    year: 2023,
    role: 'Visual Designer',
    projectType: 'Community Project (KKN-T)',
    summary:
      'Visual identity design and packaging assets crafted for local micro-enterprises in Lakessi, Parepare, empowering local market presence.',
    coverImage: '/images/umkm-lakessi-cover.webp',
    featured: true,
    tags: ['Branding', 'Packaging', 'Visual Identity', 'Typography'],
  },
];

export const mockExperiences = [
  {
    id: 'lab-assistant',
    organization: 'Web Programming Laboratory',
    role: 'Laboratory Assistant',
    type: 'Academic',
    period: '2023 — Present',
    isCurrent: true,
    description:
      'Guided university students through practical web development sessions, grading assignments, assisting module development, and conducting hands-on coding labs.',
  },
  {
    id: 'diskominfo',
    organization: 'Diskominfo Kota Makassar',
    role: 'UI/UX & Front-End Intern',
    type: 'Internship',
    period: '2024',
    isCurrent: false,
    description:
      'Collaborated with the public services team to design interface solutions for Website Kelurahan Cantik and implemented front-end code components.',
  },
  {
    id: 'bpjs-kesehatan',
    organization: 'BPJS Kesehatan Makassar',
    role: 'Operational & Data Support Intern',
    type: 'Internship',
    period: '2023',
    isCurrent: false,
    description:
      'Facilitated health-facility data validation, digital archiving, document organization, and administrative operational workflows.',
  },
];
