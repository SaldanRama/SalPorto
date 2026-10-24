export const experienceSchema = {
  name: 'experience',
  title: 'Career & Track Record Experience',
  type: 'document',
  fields: [
    {
      name: 'role',
      title: 'Job Title / Position',
      type: 'string',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g. Creative & Media Producer Specialist',
    },
    {
      name: 'organization',
      title: 'Institution / Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g. PusakaBugis.id (Kemenbud)',
    },
    {
      name: 'period',
      title: 'Period / Duration',
      type: 'string',
      placeholder: 'e.g. Agustus 2024 — Sekarang or Januari — Mei 2025',
    },
    {
      name: 'type',
      title: 'Experience Type',
      type: 'string',
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
      name: 'isCurrent',
      title: 'Current Active Role',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'sortOrder',
      title: 'Display Order (Lowest number appears first, e.g. 0, 1, 2)',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logos',
      title: 'Institution Logos (Upload one or more official logos)',
      type: 'array',
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
      of: [{ type: 'text', rows: 2 }],
      description: 'Each item represents a key focus area or contribution rendered with a clean dot bullet.',
    },
    {
      name: 'tools',
      title: 'Tools & Creative Stack Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g. Photoshop, Affinity, Canva, CapCut, VS Code, Figma, React, Notion',
    },
    {
      name: 'images',
      title: 'Documentation Photos (Photo Stack & Lightbox)',
      type: 'array',
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
      name: 'description',
      title: 'General Overview / Summary',
      type: 'text',
      rows: 3,
    },
  ],
  orderings: [
    {
      title: 'Sort Order (0, 1, 2...)',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'organization',
      media: 'logos.0',
    },
  },
};
