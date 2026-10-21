# DESIGN.md --- Visual & Interaction Design System

## 1. Product direction

**Project:** Saldan Rama --- Personal Portfolio\
**Purpose:** Present selected work, professional experience, skills, and
contact details in a memorable, credible, recruiter- and client-friendly
portfolio.

The website should feel like a premium creative studio landing page:
editorial typography, generous whitespace, art-directed project imagery,
subtle motion, and clear navigation. The supplied Mindly reference is a
visual direction reference, not a template to copy.

### Design principles

1.  **Impact first, clarity always:** strong first-screen composition,
    but the visitor should understand who Saldan is and what he does
    within seconds.
2.  **Show the work:** project images and case studies should receive
    more attention than decorative UI.
3.  **Motion with purpose:** animation guides attention or communicates
    state; it must not delay reading or navigation.
4.  **Consistent, not repetitive:** reuse the same spacing, typography,
    cards, and motion rules while allowing each project cover to have
    its own art direction.
5.  **Accessible by default:** readable contrast, keyboard support,
    reduced-motion support, and responsive layouts.
6.  **Honest presentation:** distinguish personal projects, academic
    projects, internship contributions, and team work. Never invent
    results or imply a project was deployed if it was only a prototype.

## 2. Visual reference interpretation

From the supplied reference: - Warm off-white canvas and black
typography. - Large editorial headline with a serif/italic contrast. -
Compact navigation and pill-shaped actions. - Floating content cards
around a central visual. - Fine lines, small captions,
circular/stamp-like accents. - Soft cool lavender-blue glow around the
outer frame. - High contrast between quiet whitespace and a bold focal
point.

Translate this into a portfolio identity. Do not reproduce Mindly's
logo, copy, exact composition, or branded elements.

## 3. Color tokens

Use CSS variables so themes can change without duplicating component
styles.

### Light theme

  Token               Value       Use
  ------------------- ----------- ----------------------------------
  `--bg`              `#F7F6F1`   Main page background
  `--surface`         `#FFFEFA`   Cards, menus, elevated panels
  `--text`            `#171717`   Main text
  `--muted`           `#777773`   Secondary text
  `--line`            `#E4E2DC`   Borders and separators
  `--accent`          `#D9DFFF`   Lavender-blue glow/accent
  `--accent-strong`   `#AEBEFF`   Focus rings and selected details
  `--inverse`         `#111111`   Dark CTA background
  `--inverse-text`    `#FFFFFF`   Text on dark CTA
  `--success`         `#34765B`   Status only

### Dark theme

  Token               Value       Use
  ------------------- ----------- ----------------------------
  `--bg`              `#111210`   Main page background
  `--surface`         `#1A1B18`   Cards, menus, panels
  `--text`            `#F4F2EC`   Main text
  `--muted`           `#B0B0A8`   Secondary text
  `--line`            `#34352F`   Borders and separators
  `--accent`          `#BFC9FF`   Lavender-blue highlight
  `--accent-strong`   `#D9DFFF`   Focus and selected details
  `--inverse`         `#F4F2EC`   CTA background
  `--inverse-text`    `#111210`   CTA text
  `--success`         `#80C5A3`   Status only

### Color rules

-   Use the accent sparingly: glow, tiny markers, active navigation,
    focus states, and selected details.
-   Avoid placing long body copy on top of the glow.
-   Do not use pure white as the entire light background; retain the
    warm tone.
-   Do not use pure black for every dark surface; preserve layered
    depth.
-   Verify contrast for text and controls before release.
-   Use gradients as atmosphere, not as a substitute for hierarchy.

## 4. Typography

Preferred pairing: - **Display/headings:** `DM Serif Display` or
`Instrument Serif` for editorial headlines. - **UI/body:** `DM Sans` or
`Inter` for navigation, descriptions, buttons, metadata. - Optional
expressive italic: use the display serif italic for one phrase in a
headline.

Suggested scale (fluid where practical): - Hero display:
`clamp(3.25rem, 8vw, 7.5rem)`, line-height 0.88--1.0. - H1:
`clamp(2.5rem, 5vw, 5rem)`. - H2: `clamp(2rem, 3.5vw, 3.5rem)`. - H3:
`1.25–1.75rem`. - Body large: `1.125rem`. - Body: `1rem`, line-height
1.55--1.75. - Caption/metadata: `0.75–0.875rem`; avoid tiny text for
important information.

Use uppercase labels only for short metadata, with moderate tracking.
Keep paragraphs to a comfortable reading width.

## 5. Layout and spacing

-   Main content max width: approximately `1440px`.
-   Desktop horizontal gutter: `clamp(1.25rem, 4vw, 4.5rem)`.
-   Mobile gutter: `1.125rem–1.375rem`.
-   Section spacing: generous, generally `6–10rem` desktop and `4–6rem`
    mobile.
-   Use a 12-column grid on desktop and a 4-column or single-column grid
    on mobile.
-   Favor asymmetry in hero and project editorial layouts, but keep
    reading order logical.
-   Use rounded corners intentionally: large project media can use
    `20–28px`; small controls can be pill-shaped.
-   Avoid turning every section into a card. Let some content sit
    directly on the page.

## 6. Navigation and information architecture

Primary pages: - Home - About - Experience - Portfolio / Work - Graphic
Design - UI/UX Design - Web Projects - Contact - Admin dashboard
(protected; never shown as a primary public navigation item)

Navigation behavior: - Desktop: compact header, clear active state, one
primary contact CTA. - Mobile: accessible menu with visible close action
and escape-key support. - Logo/name returns to Home. - Work category
filters must be understandable and keyboard accessible. - Theme toggle
has an accessible label such as "Switch to dark mode".

## 7. Home page composition

1.  **Header:** wordmark "Saldan Rama", navigation, theme toggle,
    contact CTA.
2.  **Hero:** concise role statement; large editorial headline; short
    intro; primary CTA "Explore selected work"; secondary CTA "Contact
    me".
3.  **Hero visual:** art-directed portrait or project collage. Floating
    cards may show capabilities (UI/UX, Front-End, Graphic Design), but
    must not obscure key text.
4.  **Selected work:** 3--4 strong projects with category, role, year,
    and project type.
5.  **Capability strip:** UI/UX Design, Front-End Development, Graphic
    Design.
6.  **About preview:** short, factual introduction with link to About.
7.  **Experience preview:** selected roles and organizations.
8.  **Contact CTA:** email and relevant professional links.
9.  **Footer:** compact navigation, copyright, social links.

Avoid putting every detail on the Home page. Use it as a guided
overview.

## 8. Project cards and case studies

Each card should support: - Project title. - Category: Graphic Design /
UI/UX Design / Web Development. - Date or period when known. - Role and
collaboration context. - Cover image. - One-sentence problem or
purpose. - Link to detail page, when a detail page exists.

Case study structure: 1. Overview and project metadata. 2. Context /
problem. 3. Goals and constraints. 4. My role and collaborators. 5.
Process and key decisions. 6. Selected visuals (screens, mockups,
before/after where valid). 7. Outcome / deliverables. 8. Reflection and
next steps.

Use descriptive alt text. Provide image captions where context matters.
Never invent metrics, user counts, client outcomes, or business impact.

## 9. Motion and interaction system

Use a restrained motion system; avoid adding animation to every element.

### Recommended interactions

-   Page/section entrance: opacity + small vertical movement.
-   Hero headline: staggered line or word reveal, only after layout is
    stable.
-   Hero visual: subtle floating or parallax movement with a low
    amplitude.
-   Project cards: gentle image scale and title/arrow movement on hover.
-   Scroll reveal: reveal major sections once; do not hide essential
    content if JavaScript fails.
-   Theme switch: short color transition.
-   Navigation: understated active indicator.
-   Optional cursor-follow effect: desktop-only, subtle, never required
    to use the site.

### Timing guidelines

-   Micro-interactions: 140--220 ms.
-   Hover transitions: 180--280 ms.
-   Section reveal: 450--750 ms.
-   Stagger: 40--90 ms.
-   Use easing such as `cubic-bezier(0.22, 1, 0.36, 1)`.

### Accessibility and performance

-   Respect `prefers-reduced-motion: reduce`.
-   No flashing, forced scrolling, or scroll hijacking.
-   Do not delay CTA availability until an animation completes.
-   Avoid heavy full-screen video backgrounds.
-   Animate `transform` and `opacity` where possible.
-   Ensure content is readable if animation libraries fail.
-   Keep motion subtle on mobile and low-power devices.

## 10. Responsive behavior

-   Mobile-first implementation.
-   At narrow widths, stack hero content; keep headline readable and
    avoid clipping.
-   Convert floating hero cards into a simpler static composition on
    mobile if needed.
-   Project grids: 3 columns desktop, 2 medium, 1 mobile.
-   Ensure tables, long titles, and project screenshots do not overflow.
-   Keep tap targets approximately 44 × 44 CSS pixels.
-   Test at 360px, 390px, 768px, 1024px, and wide desktop.

## 11. Light/dark mode behavior

-   Use one shared component system with CSS variables.
-   Initial theme: respect saved preference if implemented; otherwise
    use system preference.
-   Persist theme choice in `localStorage` only after confirming
    client-side runtime.
-   Avoid theme flash by applying the initial theme before or during app
    startup.
-   Ensure project screenshots remain visually faithful; do not invert
    their pixels.
-   Verify text, borders, focus rings, shadows, and modal overlays in
    both themes.

## 12. Design acceptance checklist

-   [ ] Looks intentional in light and dark modes.
-   [ ] Hero communicates name, focus, and next action within a few
    seconds.
-   [ ] Project imagery is prominent and loads without layout shift.
-   [ ] Motion is purposeful and reduced-motion aware.
-   [ ] Navigation and controls work with keyboard.
-   [ ] Text and interactive elements have sufficient contrast.
-   [ ] Mobile layouts have no horizontal overflow.
-   [ ] Project descriptions accurately state role, scope, and outcome.
-   [ ] Loading, empty, error, and not-found states are designed.
