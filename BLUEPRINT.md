# BLUEPRINT.md --- Product, Pages, Architecture & Build Plan

## 1. Project summary

**Name:** Saldan Rama Portfolio\
**Frontend:** React + Vite\
**Styling:** CSS variables + CSS Modules or a consistent utility
approach\
**Motion:** choose one primary library (e.g. Motion for React) rather
than mixing several animation libraries\
**Backend services:** Supabase Auth, Database, and Storage\
**Deployment:** Vercel\
**IDE/workflow:** Antigravity, with these documents treated as the
project's source of truth.

The product is a public portfolio website plus a protected admin area to
manage content without editing source files for routine updates.

## 2. Goals and non-goals

### Goals

-   Present work across Graphic Design, UI/UX Design, and Web Projects.
-   Tell a clear story about the creator, experience, process, and
    skills.
-   Provide engaging but accessible typography, image animation, and
    interactive details.
-   Support light and dark themes.
-   Support Indonesian and English content (implementation can be
    staged).
-   Allow an authenticated admin to create, edit, publish, unpublish,
    reorder, and delete projects.
-   Upload and manage project images using Supabase Storage.
-   Work well on desktop, tablet, and mobile.
-   Be maintainable as projects and images increase.

### Non-goals for the initial release

-   Public user accounts or visitor profiles.
-   Complex analytics dashboard.
-   Multiple admin roles unless a real need emerges.
-   Custom-built image-processing infrastructure.
-   Claims about project performance that have not been measured.
-   Recreating the reference website pixel-for-pixel.

## 3. Information architecture and routes

  ----------------------------------------------------------------------------
  Route                        Access                  Purpose
  ---------------------------- ----------------------- -----------------------
  `/`                          Public                  Home and selected work

  `/about`                     Public                  Background, approach,
                                                       capabilities

  `/experience`                Public                  Work, internship,
                                                       teaching assistant,
                                                       volunteer experience

  `/work`                      Public                  All published projects
                                                       and filters

  `/work/graphic-design`       Public                  Graphic design projects

  `/work/ui-ux`                Public                  UI/UX projects

  `/work/web`                  Public                  Web projects

  `/work/:slug`                Public                  Project detail / case
                                                       study

  `/contact`                   Public                  Contact methods and
                                                       optional form

  `/admin/login`               Public entry            Admin authentication

  `/admin`                     Protected               Dashboard overview

  `/admin/projects`            Protected               Project list and
                                                       management

  `/admin/projects/new`        Protected               Create project

  `/admin/projects/:id/edit`   Protected               Edit project

  `/admin/experience`          Protected               Manage experience
                                                       entries

  `/admin/profile`             Protected               Manage profile, links,
                                                       and introductory
                                                       content

  `*`                          Public                  Not-found page
  ----------------------------------------------------------------------------

Avoid adding every admin route before the first vertical slice works.
The minimum useful admin version is login + project CRUD + image upload.

## 4. Public page requirements

### Home

-   Header with name/wordmark, navigation, theme switch, and contact
    CTA.
-   Hero headline, short intro, role/capability labels, and CTAs.
-   Hero visual inspired by the reference's editorial layout, floating
    panels, and soft lavender glow.
-   Selected-work section populated from published projects.
-   Short About and Experience previews.
-   Contact CTA and footer.
-   Avoid hardcoding project cards separately from the database-driven
    Work page.

### About

-   Bio, design/development approach, current interests, skills, and
    links.
-   Keep claims factual and editable from admin when practical.
-   Do not use generic claims like "world-class" or "award-winning"
    without evidence.

### Experience

-   Timeline or editorial list with organization, title, date range,
    location (if relevant), description, and contribution bullets.
-   Support current roles and unknown end dates.
-   Clearly distinguish employment, internship, teaching assistant,
    organization, and volunteer work.

### Work listing

-   Filter by category and optional tags.
-   Support search only if the number of projects justifies it.
-   Each card has image, title, category, year, short summary, and link.
-   Include loading, empty, and error states.
-   Only published projects appear publicly.

### Project detail

-   Read project by slug.
-   Show role, timeframe, category, context, contribution, process,
    deliverables, image gallery, and reflection.
-   UI/UX projects can include challenge, research, design decisions,
    prototype, and evaluation method.
-   Graphic design projects can include brief, visual direction,
    deliverables, and mockups.
-   Web projects can include goals, features, stack, screenshots, and
    repository/live links when available.
-   Omit fields that are not applicable; do not fill gaps with invented
    facts.

### Contact

-   Show a clear email contact and selected professional/social links.
-   If using a form, validate inputs and protect submission with
    server-side checks or an appropriate managed service.
-   Do not expose private contact details unless intended for public
    display.

## 5. Admin dashboard requirements

### Dashboard overview

-   Summary cards may show total projects, published projects, drafts,
    and experience entries.
-   Keep the dashboard functional before making it visually elaborate.

### Project management

-   Create, read, update, delete.
-   Draft/published status.
-   Category and tags.
-   Title, slug, summary, body/case study sections.
-   Indonesian and English text fields.
-   Cover image and optional gallery images.
-   Alt text and captions.
-   Year/period, role, team context, featured flag, sort order.
-   Optional external links (prototype, live site, repository) when
    applicable.
-   Confirm destructive actions.
-   Show upload progress, success, and failure feedback.

### Image management

-   Upload supported image types (JPEG, PNG, WebP; SVG only if sanitized
    and intentionally supported).
-   Set a maximum file size in UI and validate again where feasible.
-   Generate unique storage paths; do not depend on original filenames
    being unique.
-   Save the storage path in the database; derive the public URL when
    displaying public bucket assets.
-   For replacements, upload the new file successfully before removing
    the old one.
-   When deleting a project, clean up its associated storage files
    safely.
-   Consider responsive image sizes/WebP compression for large
    screenshots and mockups.
-   Do not store image binary data as base64 in database rows.

### Admin security

-   Use Supabase Auth for admin login.
-   Enforce authorization with Supabase Row Level Security (RLS) and
    Storage policies; UI route guards alone are insufficient.
-   Never ship `service_role` or secret keys to the browser.
-   Use the publishable key in the frontend only with properly
    configured RLS and Storage policies.
-   Default to deny for write actions; explicitly grant admin
    operations.
-   For a single-admin site, define a reliable admin
    identity/authorization policy. Do not assume every authenticated
    user is an admin.
-   Validate inputs and sanitize rendered rich text/HTML.
-   Protect any server-side endpoints and secrets.
-   Avoid logging passwords, tokens, or private user data.

## 6. Suggested architecture

``` text
React + Vite (Vercel)
├── Public pages
├── Admin pages
├── Reusable UI components
├── Theme and language state
└── Supabase client (publishable key)
    ├── Supabase Auth
    ├── Supabase Database (project/profile/experience metadata)
    └── Supabase Storage (image files)
```

Storage holds image files. Database holds structured information and
storage paths. Auth identifies the admin. RLS and Storage policies
enforce permissions.

Recommended initial strategy: - Public portfolio reads only published
content. - Admin creates and edits content after authentication. - Use a
public bucket for portfolio images that are intended to be public. - Use
a private bucket for sensitive drafts or files that must not be publicly
accessible. - Never put secrets in `VITE_*` variables. - Do not use a
public bucket for documents that contain private or confidential data.

## 7. Suggested data model

This is a starting point, not a requirement to create every table
immediately.

### `projects`

-   `id` UUID primary key
-   `slug` text unique
-   `category` text (`graphic-design`, `ui-ux`, `web`)
-   `title_id` text
-   `title_en` text
-   `summary_id` text
-   `summary_en` text
-   `content_id` JSONB or structured related content
-   `content_en` JSONB or structured related content
-   `cover_path` text
-   `cover_alt_id` text
-   `cover_alt_en` text
-   `gallery` JSONB or a separate `project_images` table
-   `year` integer nullable
-   `role` text nullable
-   `project_type` text nullable (personal, academic, internship,
    client, team)
-   `featured` boolean default false
-   `status` text (`draft`, `published`)
-   `sort_order` integer default 0
-   `created_at` timestamp
-   `updated_at` timestamp

### `experience`

-   `id` UUID primary key
-   `organization` text
-   `title_id` text
-   `title_en` text
-   `type` text (internship, employment, teaching, organization,
    volunteer)
-   `start_date` date nullable
-   `end_date` date nullable
-   `is_current` boolean default false
-   `description_id` text
-   `description_en` text
-   `sort_order` integer default 0
-   timestamps

### `profile`

-   One record for name, short bio, longer bio, email, location
    (optional), avatar path, and public links.
-   Do not store secrets or private account information here.

### Optional `project_images`

Use a separate table when galleries need captions, alt text, sort order,
and independent management: - `id`, `project_id`, `storage_path`,
`alt_id`, `alt_en`, `caption_id`, `caption_en`, `sort_order`.

### Data model rules

-   Prefer stable slugs for public URLs.
-   Use database constraints for unique slugs and valid status/category
    values.
-   Store paths rather than duplicating full public URLs when practical.
-   Keep project content flexible but structured; avoid an enormous
    unvalidated JSON blob.
-   Use migrations or documented SQL changes so the schema can be
    recreated.

## 8. Recommended folder structure

``` text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers/
│       ├── ThemeProvider.jsx
│       └── LanguageProvider.jsx
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── PageTransition.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── LanguageToggle.jsx
│   │   ├── ProjectCard.jsx
│   │   └── ImageWithFallback.jsx
│   └── motion/
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── ExperiencePage.jsx
│   ├── WorkPage.jsx
│   ├── ProjectDetailPage.jsx
│   ├── ContactPage.jsx
│   └── admin/
├── features/
│   ├── projects/
│   ├── experience/
│   ├── profile/
│   └── auth/
├── lib/
│   └── supabase.js
├── hooks/
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── themes.css
├── utils/
└── main.jsx

supabase/
├── migrations/
└── seed.sql

public/
└── favicon.svg
```

Use this as a guide, not a reason to create empty files for every
directory immediately.

## 9. Implementation phases

### Phase 0 --- Foundation

-   [ ] Inspect project setup and package manager.
-   [ ] Configure React + Vite.
-   [ ] Add routing.
-   [ ] Add global design tokens and typography.
-   [ ] Add responsive layout shell.
-   [ ] Establish linting and formatting if useful.

### Phase 1 --- Visual prototype

-   [ ] Build header and footer.
-   [ ] Build Home hero and selected work with temporary local data.
-   [ ] Build About and Experience.
-   [ ] Build Work listing and detail page.
-   [ ] Add light/dark mode.
-   [ ] Add motion and reduced-motion support.
-   [ ] Test mobile layout before backend integration.

### Phase 2 --- Supabase foundation

-   [ ] Create Supabase project.
-   [ ] Create tables and constraints.
-   [ ] Enable RLS on tables.
-   [ ] Create public portfolio image bucket and policies.
-   [ ] Configure Supabase Auth for admin.
-   [ ] Add `.env.local` and keep it out of version control.
-   [ ] Test public read and restricted write behavior.

### Phase 3 --- Dynamic public content

-   [ ] Fetch published projects.
-   [ ] Fetch experience and profile.
-   [ ] Build loading, empty, and error states.
-   [ ] Build slug-based project details.
-   [ ] Add image fallbacks and lazy loading.

### Phase 4 --- Admin MVP

-   [ ] Login and logout.
-   [ ] Protected admin routes.
-   [ ] Project list and draft/published state.
-   [ ] Create/edit project form.
-   [ ] Storage upload with progress and validation.
-   [ ] Gallery reorder and alt text.
-   [ ] Delete confirmation and storage cleanup.
-   [ ] Edit profile and experience.
-   [ ] Validate RLS/Storage policies independently of UI.

### Phase 5 --- Quality and launch

-   [ ] Test theme and language persistence.
-   [ ] Check mobile/tablet/desktop breakpoints.
-   [ ] Check keyboard navigation and reduced motion.
-   [ ] Optimize large images and prevent layout shift.
-   [ ] Add page titles, meta descriptions, social preview image,
    favicon.
-   [ ] Add 404 and failure states.
-   [ ] Configure Vercel environment variables.
-   [ ] Test production build and deployed routes.
-   [ ] Test admin access and unauthorized write attempts.

## 10. Definition of done

The first release is complete when: - Public routes load and work on
mobile and desktop. - Visitors can browse published projects and case
studies. - Light/dark mode works without unreadable states. - Core
interactions are accessible and reduced-motion aware. - Admin login is
functional. - An authorized admin can
create/edit/publish/unpublish/delete projects and upload images. -
Public users cannot modify project records or upload/delete storage
files. - No secret key is present in the client bundle. - Loading,
empty, error, and not-found states exist. - The deployed site has been
checked on Vercel.
