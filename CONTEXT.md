# CONTEXT.md --- Persistent Project Context for Antigravity

## 1. Project identity

The project is the personal portfolio website of **Saldan Rama**, an
Information Systems student and emerging creative technologist. The site
presents work in three connected areas: 1. UI/UX Design 2. Front-End /
Web Development 3. Graphic Design

The portfolio should support job applications, freelance opportunities,
and personal branding. It should communicate real skills and work
clearly without exaggerated claims.

## 2. Technical decisions

-   Frontend: React + Vite.
-   Hosting: Vercel.
-   Backend platform: Supabase.
-   Image storage: Supabase Storage.
-   Database: Supabase Postgres.
-   Authentication: Supabase Auth for the admin.
-   Language: Indonesian and English.
-   Theme: Light and dark.
-   Development environment: Antigravity IDE.
-   Use JavaScript or TypeScript consistently; inspect the existing
    project before choosing or converting. Do not mix patterns without
    reason.
-   Use one routing approach and one primary motion library.
-   Do not replace the agreed stack without explaining the trade-off and
    asking first if the change is substantial.

## 3. User background and portfolio content

### Main case study: PerdosFit

-   UI/UX design for a Gym Management System website.
-   Main design method: Double Diamond.
-   Research includes observation and interviews; evaluation plans/uses
    SEQ and UMUX-Lite where supported by actual project documentation.
-   Roles in the concept: Admin, Personal Trainer, and Member.
-   Design/prototype project; do not claim the product is fully
    implemented or deployed unless verified.
-   Relevant screens may include admin management, PT views, member
    progress, and exercise tutorial content.
-   There are no separate workout classes in the gym concept.
-   Present research, design decisions, prototype, and evaluation
    accurately.

### Website Kelurahan Cantik

-   Work undertaken during experience with Diskominfo Makassar.
-   UI/UX contribution and a small front-end contribution.
-   Clearly state individual contribution versus team output.

### UMKM visual branding

-   Community project from KKN-T in Lakessi, Parepare.
-   Work included visual identity and promotional/packaging materials
    for local businesses.
-   Potential deliverables include logos, stickers, packaging, banners,
    and social media assets.
-   Use only the deliverables that can be supported by actual files and
    documentation.

### Experience that may be included

-   BPJS Kesehatan Makassar internship: health-facility data
    validation/matching, digital archiving, document organization,
    field/operational support, and content-related work.
-   Diskominfo Makassar: UI/UX work for Website Kelurahan Cantik and
    limited front-end contribution.
-   Web Programming Laboratory Assistant: assisting practical sessions,
    assignments, projects, modules, and quizzes.
-   Organization and volunteer experience can be included selectively if
    relevant to the target role.

### Content integrity

-   Do not invent metrics, client names, awards, revenue, user counts,
    or project results.
-   Do not describe an internship/team deliverable as an entirely
    individual project.
-   Do not say a prototype is a live product.
-   If a date, result, URL, or contribution is uncertain, leave it
    editable or ask the user.
-   Use polished, concise professional language, not inflated marketing
    copy.

## 4. Desired visual direction

The user supplied a Mindly landing-page screenshot as a style reference.
The intended visual character is: - Warm off-white background. - Black
or near-black typography. - Oversized editorial headline with
serif/italic contrast. - Compact pill navigation and clear CTA
buttons. - Generous whitespace. - A central portrait/project visual with
subtle floating UI panels. - Soft lavender-blue glow near the page edges
or behind key visuals. - Small captions, fine borders, and restrained
decorative marks. - Premium, creative, modern, slightly experimental,
but still professional.

Use the reference as inspiration only. Do not copy its logo, text, brand
identity, or exact layout.

Refer to `DESIGN.md` for color tokens, typography, motion,
accessibility, and responsive rules. Refer to `BLUEPRINT.md` for routes,
features, architecture, and milestones.

## 5. Information architecture

Public: - Home - About - Experience - Work / Portfolio - Graphic Design
category - UI/UX Design category - Web Projects category - Project case
study detail pages - Contact

Private: - Admin login - Dashboard - Project management - Experience
management - Profile/content management

The admin dashboard should allow future content changes without editing
frontend source code for routine project updates. Build the admin MVP
after the public visual foundation is stable unless the user explicitly
changes priorities.

## 6. Motion and interaction expectations

The site should feel polished and interactive through: - Text reveal or
restrained staggered headline animation. - Subtle image entrance and
hover effects. - Project card hover interactions. - Small floating
panels or decorative elements in the hero. - Scroll-triggered reveals
for major sections. - Smooth light/dark theme transition. - Responsive
navigation and clear focus states.

All motion must be purposeful, restrained, performant, and compatible
with `prefers-reduced-motion`. Essential content and controls must
remain available if animation fails. Avoid scroll hijacking, excessive
parallax, and animation that delays access to the content.

## 7. Theme behavior

-   Use CSS custom properties for shared tokens.
-   Implement light and dark themes using the same components.
-   Persist the user's theme choice where appropriate.
-   Do not invert project screenshots or portfolio artwork when changing
    theme.
-   Ensure both themes are reviewed for contrast, borders, shadows,
    hover, and focus states.

## 8. Backend and security rules

-   Supabase Storage stores files; database rows store metadata and
    storage paths.
-   Supabase Auth is used for admin authentication.
-   RLS and Storage policies enforce authorization. Hiding an admin
    route in React is not security.
-   Never expose Supabase `service_role` or secret keys in the frontend.
-   Only use the publishable key in client-side code with correct
    policies.
-   Public bucket files are readable by anyone with the URL; use public
    buckets only for assets intended for public viewing.
-   Restrict upload, update, and delete actions to the intended admin
    identity.
-   Validate file type and size; use unique storage paths.
-   Store image paths rather than base64 blobs in database rows.
-   Keep secrets in environment variables and out of source control.
-   Provide clear loading, success, empty, and error states.

## 9. How Antigravity should work

When asked to implement: 1. Read `CONTEXT.md`, `DESIGN.md`, and
`BLUEPRINT.md` first. 2. Inspect the existing files and package
configuration before making changes. 3. State a short implementation
plan for multi-file or architectural work. 4. Implement in small,
coherent steps. 5. Reuse existing components and tokens; do not
duplicate patterns. 6. Do not replace real project content with
fabricated portfolio claims. 7. Do not install multiple libraries for
the same purpose. 8. Do not create every planned feature at once. Follow
the milestones in `BLUEPRINT.md`. 9. Run available lint/build checks
after meaningful changes. 10. Report what changed, which files were
touched, how to test it, and any remaining configuration steps. 11. If
blocked by missing credentials or user-specific content, use safe
placeholders and clearly identify what the user must supply. 12. Ask
before making substantial changes to the stack, visual direction,
routes, or data model.

## 10. Current priorities

Recommended order: 1. Inspect/create React + Vite foundation. 2.
Establish typography, colors, theme system, layout, and navigation. 3.
Build a high-quality responsive Home page using temporary local project
data. 4. Build Work listing and project detail templates. 5. Build About
and Experience pages. 6. Add motion and accessibility checks. 7. Connect
Supabase tables and Storage. 8. Implement admin authentication,
policies, and project CRUD. 9. Deploy to Vercel and validate the
production build.

The initial goal is a distinctive and credible public portfolio; the
admin dashboard is a planned content-management capability, not an
excuse to delay the visual foundation.
