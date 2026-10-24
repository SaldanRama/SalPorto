import { FolderGit2 } from 'lucide-react';

export const projectSchema = {
  name: 'project',
  title: 'Project & Case Study',
  type: 'document',
  icon: FolderGit2,
  groups: [
    { name: 'main', title: '📋 Info Proyek', default: true },
    { name: 'media', title: '🖼️ Media & Cover' },
    { name: 'taxonomy', title: '🏷️ Kategori & Tags' },
    { name: 'settings', title: '⚙️ Publikasi & Urutan' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
      placeholder: 'e.g. Redesign SIMRS RSUD Hasanuddin',
    },
    {
      name: 'slug',
      title: 'Slug (URL Web)',
      type: 'slug',
      group: 'main',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Your Role / Tanggung Jawab',
      type: 'string',
      group: 'main',
      placeholder: 'e.g. Lead UI/UX Designer & Prototyper',
    },
    {
      name: 'projectType',
      title: 'Project Type / Context',
      type: 'string',
      group: 'main',
      placeholder: 'e.g. Government, Academic, Community Project (KKN-T)',
    },
    {
      name: 'summary',
      title: 'Summary / Ringkasan Proyek',
      type: 'text',
      group: 'main',
      rows: 3,
      placeholder: 'Ringkasan singkat tentang tujuan dan dampak proyek ini...',
    },
    {
      name: 'coverImage',
      title: 'Cover Image (Hero / Thumbnail)',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      description: 'Gambar utama yang tampil di daftar project dan header halaman detail.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'taxonomy',
      options: {
        list: [
          { title: 'UI/UX Design', value: 'ui-ux' },
          { title: 'Web Projects', value: 'web' },
          { title: 'Graphic Design', value: 'graphic-design' },
        ],
      },
      initialValue: 'ui-ux',
    },
    {
      name: 'categoryLabel',
      title: 'Category Label (Display Text)',
      type: 'string',
      group: 'taxonomy',
      placeholder: 'e.g. UI/UX Design, Web / UI/UX',
    },
    {
      name: 'year',
      title: 'Year / Tahun Pembuatan',
      type: 'number',
      group: 'taxonomy',
      initialValue: new Date().getFullYear(),
    },
    {
      name: 'tags',
      title: 'Tags / Keywords',
      type: 'array',
      group: 'taxonomy',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      placeholder: 'e.g. Figma, Wireframing, Usability Testing',
    },
    {
      name: 'featured',
      title: 'Featured on Home Showcase (Tampil di Beranda)',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    },
    {
      name: 'published',
      title: 'Published (Tampil di Website Publik)',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sort Order (0, 1, 2...)',
      type: 'number',
      group: 'settings',
      initialValue: 0,
      description: 'Nomor urutan tampilan di galeri proyek.',
    },
  ],
  orderings: [
    {
      title: 'Sort Order (0, 1, 2...)',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Year, Newest First',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'categoryLabel',
      media: 'coverImage',
      published: 'published',
      featured: 'featured',
      sortOrder: 'sortOrder',
    },
    prepare({ title, subtitle, media, published, featured, sortOrder }) {
      const pubTag = published === false ? ' • 🔒 [Draft]' : ' • 🟢 [Live]';
      const featTag = featured ? ' ⭐' : '';
      const orderTag = typeof sortOrder === 'number' ? `[#${sortOrder}] ` : '';
      return {
        title: `${orderTag}${title || 'Untitled Project'}${featTag}`,
        subtitle: `${subtitle || 'Belum ada kategori'}${pubTag}`,
        media,
      };
    },
  },
};
