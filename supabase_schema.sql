-- ==============================================================================
-- SALPORTO SUPABASE DATABASE & STORAGE SETUP SCRIPT
-- Copy and paste this script directly into your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  year INTEGER,
  role TEXT,
  project_type TEXT,
  summary TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. CREATE EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  period TEXT NOT NULL,
  type TEXT DEFAULT 'Internship',
  is_current BOOLEAN DEFAULT false,
  logo TEXT,
  jobdesk JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Ensure 'tools' column exists even if table was created earlier
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]'::jsonb;

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PROJECTS & EXPERIENCES
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
DROP POLICY IF EXISTS "Allow All Projects" ON public.projects;

DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin All Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow All Experiences" ON public.experiences;

-- Create open policies for personal portfolio website
CREATE POLICY "Allow All Projects" ON public.projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow All Experiences" ON public.experiences
  FOR ALL USING (true) WITH CHECK (true);

-- 5. STORAGE BUCKET CREATION FOR PORTFOLIO IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop old storage policies if any
DROP POLICY IF EXISTS "Public Access Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Storage" ON storage.objects;
DROP POLICY IF EXISTS "Storage Select Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Insert Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Update Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Delete Policy" ON storage.objects;

-- Create storage policies allowing read, upload, update, and delete on 'portfolio-images' bucket
CREATE POLICY "Storage Select Policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Insert Policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Update Policy" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-images');

CREATE POLICY "Storage Delete Policy" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-images');

-- 6. INSERT INITIAL SEED DATA (If table is empty)
INSERT INTO public.projects (id, slug, title, category, category_label, year, role, project_type, summary, cover_image, featured, published, tags)
VALUES 
  (
    'perdosfit', 'perdosfit', 'PerdosFit', 'ui-ux', 'UI/UX Design', 2024,
    'UI/UX Designer', 'Academic / Conceptual Case Study',
    'A Gym Management System web concept built using the Double Diamond methodology, tailored for Admin, Personal Trainer, and Member roles.',
    '/images/perdosfit-cover.webp', true, true,
    '["UI/UX", "Double Diamond", "Figma", "System Design"]'::jsonb
  ),
  (
    'kelurahan-cantik', 'kelurahan-cantik', 'Website Kelurahan Cantik', 'web', 'Web / UI/UX', 2024,
    'UI/UX Designer & Front-End Contributor', 'Government / Diskominfo Makassar',
    'Community statistical website initiative developed with Diskominfo Makassar to present administrative village data clearly and transparently.',
    '/images/kelurahan-cantik-cover.webp', true, true,
    '["UI/UX", "Front-End", "Public Service", "Design System"]'::jsonb
  ),
  (
    'umkm-lakessi', 'umkm-lakessi', 'UMKM Lakessi Visual Branding', 'graphic-design', 'Graphic Design', 2023,
    'Visual Designer', 'Community Project (KKN-T)',
    'Visual identity design and packaging assets crafted for local micro-enterprises in Lakessi, Parepare, empowering local market presence.',
    '/images/umkm-lakessi-cover.webp', true, true,
    '["Branding", "Packaging", "Visual Identity", "Typography"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.experiences (id, role, organization, period, type, is_current, logo, jobdesk, tools, images, sort_order)
VALUES 
  (
    'lab-assistant',
    'Laboratory Assistant (Asisten Laboratorium)',
    'Web Programming Laboratory — Universitas Hasanuddin',
    'Agustus 2023 — Sekarang',
    'Academic', true, '/images/UnhasLogo.png',
    '["Membimbing lebih dari 100+ mahasiswa dalam praktikum intensif Web Development (HTML5, CSS3, Modern JavaScript, React, dan PHP/Laravel).", "Menyusun silabus, modul praktikum kurikulum teknologi web terkini, materi hands-on coding, serta tugas studi kasus riil.", "Melakukan code review komprehensif, pemeriksaan best practices arsitektur web, dan evaluasi berkala tugas praktikum.", "Memfasilitasi sesi troubleshooting bug, debugging instruksional, serta pendampingan proyek akhir mahasiswa."]'::jsonb,
    '["VS Code", "React", "JavaScript", "PHP", "Laravel"]'::jsonb,
    '[{"url": "/images/experience/01-lab-assistant/image-1.svg", "title": "Sesi Praktikum Coding & Lab Mentoring", "caption": "Membimbing mahasiswa dalam penguasaan fundamental web modern dan arsitektur aplikasi di laboratorium."}, {"url": "/images/experience/01-lab-assistant/image-2.svg", "title": "Review Kode & Evaluasi Tugas Mahasiswa", "caption": "Pemeriksaan standar kode, semantic markup, optimasi performa, dan pengujian fungsionalitas aplikasi."}, {"url": "/images/experience/01-lab-assistant/image-3.svg", "title": "Penyusunan Modul & Workshop Arsitektur Web", "caption": "Pengembangan bahan ajar praktikum terstruktur mencakup client-server, REST API, dan basis data."}]'::jsonb,
    1
  ),
  (
    'diskominfo',
    'UI/UX Designer & Front-End Intern',
    'Diskominfo Kota Makassar (Dinas Komunikasi & Informatika)',
    'Juli 2024 — September 2024',
    'Internship', false, '/images/KominfoLogo.png',
    '["Merancang arsitektur informasi, alur pengalaman pengguna (user journey), dan antarmuka web portal \"Website Kelurahan Cantik\".", "Membuat wireframe, prototipe interaktif high-fidelity, serta atomic design system yang konsisten di Figma.", "Mengimplementasikan komponen antarmuka front-end responsif berbasis standar web modern yang ramah aksesibilitas publik.", "Melakukan usability evaluation bersama tim Diskominfo serta mengiterasi desain berdasarkan masukan para pemangku kepentingan."]'::jsonb,
    '["Figma", "VS Code", "JavaScript", "CSS3"]'::jsonb,
    '[{"url": "/images/experience/02-diskominfo/image-1.svg", "title": "Antarmuka Portal Layanan Publik Kelurahan Cantik", "caption": "Desain visual dashboard penyajian data kependudukan dan transparansi statistik kelurahan kota Makassar."}, {"url": "/images/experience/02-diskominfo/image-2.svg", "title": "Figma Design System & Komponen Terstandarisasi", "caption": "Penyusunan atomic components, token warna, tipografi, dan navigasi ramah pengguna di Figma."}, {"url": "/images/experience/02-diskominfo/image-3.svg", "title": "Implementasi Front-End & Pengujian Usabilitas", "caption": "Penerapan kode antarmuka web responsif dan audit standar performa serta aksesibilitas WCAG."}]'::jsonb,
    2
  ),
  (
    'bpjs-kesehatan',
    'Operational & Data Support Intern',
    'BPJS Kesehatan Cabang Utama Makassar',
    'Januari 2023 — Maret 2023',
    'Internship', false, '/images/BpjsLogo.png',
    '["Melakukan audit data, pencocokan (data matching), dan validasi database mitra Fasilitas Kesehatan (Faskes) se-Makassar.", "Menstandarisasi sistem pengarsipan digital untuk ribuan berkas administrasi dan dokumen kerja sama fasilitas kesehatan.", "Mendukung koordinasi operasional pelayanan publik dan verifikasi data rujukan berjenjang layanan kesehatan.", "Menyusun laporan rekapitulasi periodik guna meningkatkan efisiensi dan transparansi alur kerja administrasi internal cabang."]'::jsonb,
    '["Notion", "Microsoft Excel", "Data Analytics"]'::jsonb,
    '[{"url": "/images/experience/03-bpjs-kesehatan/image-1.svg", "title": "Validasi & Rekonsiliasi Data Mitra Faskes", "caption": "Pencocokan data fasilitas kesehatan dan verifikasi kelayakan dokumen administrasi faskes mitra BPJS."}, {"url": "/images/experience/03-bpjs-kesehatan/image-2.svg", "title": "Sistem Pengarsipan Digital Dokumen Operasional", "caption": "Standardisasi pengelompokan berkas digital untuk mempermudah akses retrieval berkas tim verifikator."}, {"url": "/images/experience/03-bpjs-kesehatan/image-3.svg", "title": "Laporan Rekapitulasi & Dukungan Operasional", "caption": "Penyusunan ringkasan performa verifikasi dokumen dan koordinasi lintas bagian operasional kantor cabang."}]'::jsonb,
    3
  ),
  (
    'pusakabugis',
    'Creative & Media Producer Specialist',
    'PusakaBugis.id (Kemenbud)',
    'Agustus 2024 — Sekarang',
    'Community / Project', true,
    '["/images/PusakaBugisLogo.png", "/images/KemenbudLogo.png"]',
    '["Developed the projects visual identity and creative direction to strengthen public recognition of PusakaBugis.id and encourage engagement with Bugis cultural heritage.", "Managed creative media, publications, and documentation throughout the project, including the production of visual content for digital communications.", "Planned publication schedules and developed content formats aligned with the projects communication needs and objectives.", "Created graphic design materials using Affinity Designer as the primary design tool, with Canva as a supporting tool for visual content production.", "Edited video content using CapCut to support the projects digital publications and communicate project information across digital media channels."]'::jsonb,
    '["Photoshop", "Affinity", "Canva", "CapCut"]'::jsonb,
    '[]'::jsonb,
    0
  )
ON CONFLICT (id) DO UPDATE SET 
  logo = EXCLUDED.logo,
  tools = EXCLUDED.tools,
  jobdesk = EXCLUDED.jobdesk,
  images = EXCLUDED.images;
