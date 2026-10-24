export const miniGallerySchema = {
  name: 'miniGallery',
  title: 'Mini Gallery (16:9 Coverflow)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Proyek / Gambar',
      type: 'string',
      description: 'Nama proyek atau judul karya visual.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Keterangan Singkat / Kategori',
      type: 'string',
      description: 'Misal: UI/UX Design • Mobile App Prototype atau Graphic Design.',
    },
    {
      name: 'image',
      title: 'File Gambar (Rasio Aspek 16:9 Disarankan)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'linkUrl',
      title: 'Tautan / Link Proyek (Opsional)',
      type: 'string',
      description: 'Link tujuan saat gambar diklik (e.g. /work/perdosfit atau https://...)',
    },
    {
      name: 'sortOrder',
      title: 'Nomor Urutan Tampil (Sort Order)',
      type: 'number',
      initialValue: 0,
      description: 'Urutan gambar pada carousel Coverflow (angka lebih kecil tampil lebih awal).',
    },
    {
      name: 'published',
      title: 'Publikasikan ke Beranda',
      type: 'boolean',
      initialValue: true,
      description: 'Centang untuk menampilkan gambar ini di Mini Gallery beranda.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'caption',
      media: 'image',
    },
  },
};
