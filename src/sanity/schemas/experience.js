import { Briefcase } from 'lucide-react';

export const experienceSchema = {
  name: 'experience',
  title: 'Career & Track Record Experience',
  type: 'document',
  icon: Briefcase,
  groups: [
    { name: 'main', title: '📋 Info Utama', default: true },
    { name: 'media', title: '📸 Dokumentasi & Foto' },
    { name: 'scope', title: '🛠️ Jobdesk & Tools' },
    { name: 'settings', title: '⚙️ Urutan & Status' },
  ],
  fields: [
    {
      name: 'role',
      title: 'Job Title / Position',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g. Creative & Media Producer Specialist',
    },
    {
      name: 'organization',
      title: 'Institution / Organization Name',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g. PusakaBugis.id (Kemenbud)',
    },
    {
      name: 'period',
      title: 'Period / Duration',
      type: 'string',
      group: 'main',
      placeholder: 'e.g. Agustus 2024 — Sekarang or Januari — Mei 2025',
    },
    {
      name: 'type',
      title: 'Experience Type',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Internship', value: 'Internship' },
          { title: 'Full-Time', value: 'Full-Time' },
          { title: 'Kontrak / Contract', value: 'Kontrak / Contract' },
          { title: 'Academic', value: 'Academic' },
          { title: 'Community / Project', value: 'Community / Project' },
        ],
      },
      initialValue: 'Internship',
    },
    {
      name: 'description',
      title: 'General Overview / Summary',
      type: 'text',
      group: 'main',
      rows: 3,
      placeholder: 'Ringkasan singkat tentang tanggung jawab utama atau pencapaian di posisi ini...',
    },
    {
      name: 'images',
      title: 'Documentation Photos (Photo Stack & Lightbox)',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Photo File',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Photo Title',
              type: 'string',
              placeholder: 'e.g. Antarmuka Portal Layanan Publik',
            },
            {
              name: 'caption',
              title: 'Description / Caption',
              type: 'text',
              rows: 2,
              placeholder: 'e.g. Sesi dokumentasi kegiatan praktikum mahasiswa di laboratorium.',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'caption',
              media: 'image',
            },
          },
        },
      ],
      description: 'Upload 3+ photos for the interactive stacked card deck and high-res lightbox preview.',
    },
    {
      name: 'logos',
      title: 'Institution Logos (Upload one or more official logos)',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: 'Upload PNG/SVG logo badge for institution (e.g. PusakaBugis + Kemenbud).',
    },
    {
      name: 'jobdesk',
      title: 'Core Contributions & Scope (List of Focus Areas)',
      type: 'array',
      group: 'scope',
      of: [{ type: 'text', rows: 2 }],
      description: 'Each item represents a key focus area or contribution rendered with a clean dot bullet.',
    },
    {
      name: 'tools',
      title: 'Tools & Creative Stack Used',
      type: 'array',
      group: 'scope',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g. Photoshop, Affinity, Canva, CapCut, VS Code, Figma, React, Notion',
    },
    {
      name: 'sortOrder',
      title: 'Display Order (Lowest number appears first, e.g. 0, 1, 2)',
      type: 'number',
      group: 'settings',
      initialValue: 0,
      validation: (Rule) => Rule.required(),
      description: 'Angka urutan tampilan. Angka 0, 1, 2 akan otomatis tampil di Homepage Timeline (Top 3).',
    },
    {
      name: 'isCurrent',
      title: 'Current Active Role (Posisi yang sedang aktif dijalani)',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: 'Sort Order (0, 1, 2...)',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Role Name (A-Z)',
      name: 'roleAsc',
      by: [{ field: 'role', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'role',
      organization: 'organization',
      period: 'period',
      type: 'type',
      isCurrent: 'isCurrent',
      sortOrder: 'sortOrder',
      media: 'logos.0',
    },
    prepare({ title, organization, period, type, isCurrent, sortOrder, media }) {
      const activeTag = isCurrent ? ' • 🟢 Aktif' : '';
      const orderTag = typeof sortOrder === 'number' ? `[#${sortOrder}] ` : '';
      return {
        title: `${orderTag}${title || 'Untitled Experience'}`,
        subtitle: `${organization || 'No Organization'} • ${period || type || ''}${activeTag}`.trim(),
        media,
      };
    },
  },
};
