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
    role: 'Laboratory Assistant (Asisten Laboratorium)',
    organization: 'Web Programming Laboratory — Universitas Hasanuddin',
    period: 'Agustus 2023 — Sekarang',
    type: 'Academic',
    isCurrent: true,
    logo: '/images/UnhasLogo.png',
    jobdesk: [
      'Membimbing lebih dari 100+ mahasiswa dalam praktikum intensif Web Development (HTML5, CSS3, Modern JavaScript, React, dan PHP/Laravel).',
      'Menyusun silabus, modul praktikum kurikulum teknologi web terkini, materi hands-on coding, serta tugas studi kasus riil.',
      'Melakukan code review komprehensif, pemeriksaan best practices arsitektur web, dan evaluasi berkala tugas praktikum.',
      'Memfasilitasi sesi troubleshooting bug, debugging instruksional, serta pendampingan proyek akhir mahasiswa.'
    ],
    tools: ['VS Code', 'React', 'JavaScript', 'PHP', 'Laravel'],
    images: [
      {
        url: '/images/experience/01-lab-assistant/image-1.svg',
        title: 'Sesi Praktikum Coding & Lab Mentoring',
        caption: 'Membimbing mahasiswa dalam penguasaan fundamental web modern dan arsitektur aplikasi di laboratorium.'
      },
      {
        url: '/images/experience/01-lab-assistant/image-2.svg',
        title: 'Review Kode & Evaluasi Tugas Mahasiswa',
        caption: 'Pemeriksaan standar kode, semantic markup, optimasi performa, dan pengujian fungsionalitas aplikasi.'
      },
      {
        url: '/images/experience/01-lab-assistant/image-3.svg',
        title: 'Penyusunan Modul & Workshop Arsitektur Web',
        caption: 'Pengembangan bahan ajar praktikum terstruktur mencakup client-server, REST API, dan basis data.'
      }
    ],
    description:
      'Guided university students through practical web development sessions, grading assignments, assisting module development, and conducting hands-on coding labs.'
  },
  {
    id: 'diskominfo',
    role: 'UI/UX Designer & Front-End Intern',
    organization: 'Diskominfo Kota Makassar (Dinas Komunikasi & Informatika)',
    period: 'Juli 2024 — September 2024',
    type: 'Internship',
    isCurrent: false,
    logo: '/images/KominfoLogo.png',
    jobdesk: [
      'Merancang arsitektur informasi, alur pengalaman pengguna (user journey), dan antarmuka web portal "Website Kelurahan Cantik".',
      'Membuat wireframe, prototipe interaktif high-fidelity, serta atomic design system yang konsisten di Figma.',
      'Mengimplementasikan komponen antarmuka front-end responsif berbasis standar web modern yang ramah aksesibilitas publik.',
      'Melakukan usability evaluation bersama tim Diskominfo serta mengiterasi desain berdasarkan masukan para pemangku kepentingan.'
    ],
    tools: ['Figma', 'VS Code', 'JavaScript', 'CSS3'],
    images: [
      {
        url: '/images/experience/02-diskominfo/image-1.svg',
        title: 'Antarmuka Portal Layanan Publik Kelurahan Cantik',
        caption: 'Desain visual dashboard penyajian data kependudukan dan transparansi statistik kelurahan kota Makassar.'
      },
      {
        url: '/images/experience/02-diskominfo/image-2.svg',
        title: 'Figma Design System & Komponen Terstandarisasi',
        caption: 'Penyusunan atomic components, token warna, tipografi, dan navigasi ramah pengguna di Figma.'
      },
      {
        url: '/images/experience/02-diskominfo/image-3.svg',
        title: 'Implementasi Front-End & Pengujian Usabilitas',
        caption: 'Penerapan kode antarmuka web responsif dan audit standar performa serta aksesibilitas WCAG.'
      }
    ],
    description:
      'Collaborated with the public services team to design interface solutions for Website Kelurahan Cantik and implemented front-end code components.'
  },
  {
    id: 'bpjs-kesehatan',
    role: 'Operational & Data Support Intern',
    organization: 'BPJS Kesehatan Cabang Utama Makassar',
    period: 'Januari 2023 — Maret 2023',
    type: 'Internship',
    isCurrent: false,
    logo: '/images/BpjsLogo.png',
    jobdesk: [
      'Melakukan audit data, pencocokan (data matching), dan validasi database mitra Fasilitas Kesehatan (Faskes) se-Makassar.',
      'Menstandarisasi sistem pengarsipan digital untuk ribuan berkas administrasi dan dokumen kerja sama fasilitas kesehatan.',
      'Mendukung koordinasi operasional pelayanan publik dan verifikasi data rujukan berjenjang layanan kesehatan.',
      'Menyusun laporan rekapitulasi periodik guna meningkatkan efisiensi dan transparansi alur kerja administrasi internal cabang.'
    ],
    tools: ['Notion', 'Microsoft Excel', 'Data Analytics'],
    images: [
      {
        url: '/images/experience/03-bpjs-kesehatan/image-1.svg',
        title: 'Validasi & Rekonsiliasi Data Mitra Faskes',
        caption: 'Pencocokan data fasilitas kesehatan dan verifikasi kelayakan dokumen administrasi faskes mitra BPJS.'
      },
      {
        url: '/images/experience/03-bpjs-kesehatan/image-2.svg',
        title: 'Sistem Pengarsipan Digital Dokumen Operasional',
        caption: 'Standardisasi pengelompokan berkas digital untuk mempermudah akses retrieval berkas tim verifikator.'
      },
      {
        url: '/images/experience/03-bpjs-kesehatan/image-3.svg',
        title: 'Laporan Rekapitulasi & Dukungan Operasional',
        caption: 'Penyusunan ringkasan performa verifikasi dokumen dan koordinasi lintas bagian operasional kantor cabang.'
      }
    ],
    description:
      'Facilitated health-facility data validation, digital archiving, document organization, and administrative operational workflows.'
  },
  {
    id: 'pusakabugis',
    role: 'Creative & Media Producer Specialist',
    organization: 'PusakaBugis.id (Kemenbud)',
    period: 'Agustus 2024 — Sekarang',
    type: 'Community / Project',
    isCurrent: true,
    logo: ['/images/PusakaBugisLogo.png', '/images/KemenbudLogo.png'],
    jobdesk: [
      'Developed the projects visual identity and creative direction to strengthen public recognition of PusakaBugis.id and encourage engagement with Bugis cultural heritage.',
      'Managed creative media, publications, and documentation throughout the project, including the production of visual content for digital communications.',
      'Planned publication schedules and developed content formats aligned with the projects communication needs and objectives.',
      'Created graphic design materials using Affinity Designer as the primary design tool, with Canva as a supporting tool for visual content production.',
      'Edited video content using CapCut to support the projects digital publications and communicate project information across digital media channels.'
    ],
    tools: ['Photoshop', 'Affinity', 'Canva', 'CapCut'],
    images: [],
    description:
      'Creative direction, publication media management, visual assets, and cultural communication specialist for PusakaBugis.id supported by Kementerian Kebudayaan.'
  },
  {
    id: 'kknt-lakessi',
    role: 'Visual Identity & Branding Specialist',
    organization: 'KKN-T Gelombang 110 — Universitas Hasanuddin (Kel. Lakessi)',
    period: 'Juli 2023 — Agustus 2023',
    type: 'Community / Project',
    isCurrent: false,
    logo: '/images/UnhasLogo.png',
    jobdesk: [
      'Merancang identitas visual, kemasan produk, dan materi promosi digital untuk pelaku UMKM lokal di Kelurahan Lakessi, Parepare.',
      'Mengembangkan logo, label stiker kemasan ramah cetak, serta banner toko guna meningkatkan daya tarik pasar.',
      'Memberikan edukasi dan pendampingan branding visual serta pemanfaatan media digital bagi pemilik usaha mikro.'
    ],
    images: [],
    description:
      'Visual identity design and packaging assets crafted for local micro-enterprises in Lakessi, Parepare, empowering local market presence.'
  }
];


