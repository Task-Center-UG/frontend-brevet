# Design

## Design Intent

Tax Center Brevet LMS should feel like a premium institutional learning product: credible like a university system, sharp like a modern professional tool, and memorable like an award-quality editorial website. The public surface can be expressive. The dashboard must stay calm, dense, and fast.

Scene sentence:

A prospective brevet participant checks schedules on a phone between work and class, while an admin later reviews payments and batch progress on a desktop in an office. This requires a light-first interface, high contrast, strong hierarchy, and restrained motion that never slows task completion.

## Register

product

## Quality Bar

Target quality:

- Public pages: Awwwards-level composition without sacrificing clarity.
- Dashboard pages: mature operations UI in the league of Linear, Stripe, Notion, and Figma admin patterns.
- Auth pages: focused, secure, low-friction.
- Certificate validation: official, trust-heavy, instantly legible.

The UI should not look like a generic LMS. It should feel like Tax Center Universitas Gunadarma owns the experience.

## Visual Concept

Working concept: `Institutional Editorial System`.

Meaning:

- Use strong editorial typography for public pages.
- Use disciplined tables and forms for product pages.
- Use orange as action energy.
- Use deep purple as institutional identity.
- Use off-white and tinted neutrals instead of pure flat white where possible.
- Use real course, class, Tax Center, or document imagery rather than abstract blobs.
- Let spacing, typography, and motion create memorability.

## Non-Negotiable Design Rules

- No gradient text.
- No decorative glassmorphism.
- No background blobs, orbs, bokeh, particles, or random glows.
- No side-stripe cards or side-stripe alerts.
- No identical icon-card grids as default section structure.
- No nested cards.
- No generic SaaS hero with floating dashboard screenshot unless the screenshot is real and useful.
- No full-screen page-load animation.
- No dark-mode-first design.
- No tiny low-contrast orange text.
- No invented form controls where shadcn/Radix patterns already exist.
- No motion that does not communicate state, reveal content, or support orientation.
- No modal as first option when inline, drawer, or progressive disclosure works better.
- No em dash in UI copy.

## Color Strategy

Strategy: restrained product palette with committed brand accents.

Use orange for action and active intent. Use purple for institutional identity and navigation depth. Use warm-tinted neutrals for public editorial pages and neutral-tinted surfaces for dashboards.

### Core Brand Tokens

| Token | Value | Role |
|---|---:|---|
| `brand-orange` | `#f97316` | Primary CTA, active state, key accent, progress highlight |
| `brand-orange-dark` | `#ea580c` | Hover and pressed CTA |
| `brand-purple` | `#54458C` | Brand identity, secondary emphasis |
| `brand-purple-dark` | `#2a176f` | Sidebar, deep nav, footer depth |
| `brand-purple-mid` | `#38228a` | Sidebar active, selected nav |
| `brand-purple-soft` | `#6b4bcf` | Focus ring variant, chart accent |

### Recommended OKLCH Tokens

Prefer OKLCH for new design tokens.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `background` | `oklch(0.985 0.006 78)` | `oklch(0.16 0.012 285)` | App background |
| `foreground` | `oklch(0.19 0.018 270)` | `oklch(0.96 0.006 78)` | Primary text |
| `card` | `oklch(0.998 0.004 78)` | `oklch(0.21 0.014 285)` | Panels and cards |
| `muted` | `oklch(0.955 0.008 78)` | `oklch(0.27 0.014 285)` | Subtle background |
| `muted-foreground` | `oklch(0.47 0.018 270)` | `oklch(0.72 0.01 285)` | Secondary text |
| `border` | `oklch(0.88 0.01 78)` | `oklch(0.98 0.004 78 / 12%)` | Borders and dividers |
| `primary` | `oklch(0.72 0.19 52)` | `oklch(0.72 0.19 52)` | Orange action |
| `ring` | `oklch(0.66 0.14 286)` | `oklch(0.70 0.13 286)` | Focus ring |
| `destructive` | `oklch(0.58 0.22 28)` | `oklch(0.68 0.17 28)` | Error and delete |

Existing code currently includes white and near-black shadcn defaults. New work should gently tint neutral surfaces instead of expanding pure white or pure black usage.

### Semantic States

| State | Color Direction | Usage |
|---|---|---|
| Success | green, low chroma | Paid, completed, passed |
| Warning | amber, medium chroma | Pending, needs action, deadline soon |
| Error | red, medium chroma | Failed, expired, rejected, delete |
| Info | blue or purple, low chroma | Neutral notices |
| Draft | neutral | Not published, not submitted |
| Active | orange | Current action or selected workflow |

Rules:

- Status badges always include text.
- Use color plus icon or text, never color alone.
- Orange is not for body copy under 16px.
- Purple should not compete with orange on primary action surfaces.
- Chart colors must be distinguishable for color-blind users.

## Typography

### Font

Use Plus Jakarta Sans loaded in `app/layout.tsx`.

```css
font-family: var(--font-jakarta), system-ui, sans-serif;
```

Use a single font family for product consistency. Do not introduce display fonts unless the whole brand direction is intentionally revised.

### Product Type Scale

Use fixed rem sizes. Do not scale fonts with viewport width.

| Role | Size | Line Height | Weight | Usage |
|---|---:|---:|---:|---|
| `ui-xs` | `0.75rem` | `1rem` | 500 or 600 | Labels, badges |
| `ui-sm` | `0.875rem` | `1.25rem` | 400 to 600 | Form text, table cells |
| `ui-base` | `1rem` | `1.5rem` | 400 to 600 | Body, inputs |
| `ui-lg` | `1.125rem` | `1.75rem` | 500 to 700 | Page intros |
| `title-sm` | `1.25rem` | `1.75rem` | 700 | Card and panel title |
| `title-md` | `1.5rem` | `2rem` | 700 | Dashboard page title |
| `title-lg` | `2rem` | `2.35rem` | 800 | Public section title |
| `display-sm` | `2.75rem` | `0.98` | 800 | Mobile hero |
| `display-md` | `4.5rem` | `0.95` | 800 | Desktop hero |
| `display-lg` | `6rem` | `0.92` | 800 | Special editorial hero only |

### Typography Rules

- Letter spacing must be `0` for normal UI.
- Uppercase labels can use `tracking-[0.16em]` to `tracking-[0.22em]`.
- Body copy max width: `65ch` to `75ch`.
- Dashboard labels should not use display scale.
- Truncate long table and card names with tooltip or secondary detail.
- Never use gradient text.
- Use weight, size, spacing, and solid color for emphasis.

## Layout System

### Global Structure

Public surface:

- Full-width sections.
- Constrained inner content using `max-w-screen-xl`.
- Generous section rhythm.
- Editorial asymmetry where useful.
- One strong primary idea per section.

Dashboard surface:

- Sidebar plus content shell.
- `max-w-7xl` or full-width table workspace depending density.
- Predictable page header.
- Filters close to data.
- Actions right-aligned when they operate on the page.

### Spacing Scale

Use Tailwind spacing, but avoid equal padding everywhere.

| Token | Value | Usage |
|---|---:|---|
| `space-1` | `0.25rem` | Tight icon gap |
| `space-2` | `0.5rem` | Compact inline gap |
| `space-3` | `0.75rem` | Form inner gap |
| `space-4` | `1rem` | Standard component gap |
| `space-5` | `1.25rem` | Card content gap |
| `space-6` | `1.5rem` | Panel padding |
| `space-8` | `2rem` | Section internal rhythm |
| `space-12` | `3rem` | Public group gap |
| `space-16` | `4rem` | Public section top/bottom |
| `space-24` | `6rem` | Hero and major section rhythm |

### Radius

Use modest radii for product trust.

| Element | Radius |
|---|---:|
| Inputs, selects, textareas | `8px` |
| Dashboard cards and panels | `8px` |
| Buttons | `8px` for dashboard, pill allowed for public CTAs |
| Badges | full pill |
| Images | `12px` max on public pages |
| Dialogs, drawers | `12px` |

Avoid large rounded cards everywhere. A few pill CTAs can create friendliness; panels should stay precise.

### Borders And Shadows

- Use 1px borders more often than shadows.
- Use shadow only for elevation change, floating menu, popover, dialog, or meaningful hover.
- Public hover cards may lift slightly.
- Dashboard tables and panels should rely on border, background, and spacing.
- No colored side borders thicker than 1px.

## Component System

### Buttons

Use shadcn button vocabulary and lucide icons.

| Variant | Visual | Usage |
|---|---|---|
| Primary | Orange fill, white text | Main page action |
| Secondary | Tinted neutral or outline | Alternative action |
| Ghost | Transparent with hover surface | Toolbar and low emphasis |
| Destructive | Red fill or red subtle | Delete or irreversible action |
| Link | Text button | Inline navigation |

Rules:

- Include icons for tool actions where lucide has a known symbol.
- Do not use text-only rounded rectangles for icon-like actions.
- Loading state keeps button width stable.
- Disabled state must look disabled and block pointer events.
- Button text should stay on one line where possible.

### Forms

Use:

- `react-hook-form`.
- `zod` schemas.
- shadcn `Form`, `Input`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`, `DateTimePicker`.

Rules:

- Required fields should be clear from label or validation, not only placeholder.
- Place helper text below label or below input.
- Error text should be short and specific.
- Long forms should be grouped by meaning.
- Use progressive sections instead of one giant visual block.
- File upload must show accepted type, max size, chosen file, progress when possible, and error.

### Tables

Use TanStack Table plus shadcn table.

Table requirements:

- Search when records can exceed one page.
- Pagination for backend lists.
- Sort indicators when sortable.
- Row hover.
- Empty state.
- Skeleton state.
- Error state.
- Clear status badges.
- Action menu with predictable verbs.

Do not hide primary row identity in small gray text. Every row needs a strong first column.

### Cards And Panels

Cards are allowed for:

- Program/course items.
- Dashboard KPI panels.
- Chart panels.
- Repeated content items.
- Empty state panels.

Cards are not allowed for:

- Wrapping every section.
- Putting a card inside another card.
- Creating decorative grids with identical icon blocks.

Public cards:

- Image first when the real course or context matters.
- Clear title.
- One short supporting detail.
- Next action or affordance.
- Hover can lift and reveal intent.

Dashboard panels:

- Title, optional description, content.
- Stable height where compared side by side.
- No decorative gradients.

### Badges

Use badges for status, type, role, and class format.

Examples:

- `Online`
- `Offline`
- `Menunggu Konfirmasi`
- `Dibayar`
- `Kedaluwarsa`
- `Admin`
- `Guru`
- `Siswa`
- `Brevet A dan B`
- `Brevet C`

Rules:

- Badges should not carry full sentences.
- Use semantic colors consistently.
- Keep badge height stable.

### Navigation

Public navbar:

- Sticky top is allowed.
- Solid or lightly tinted background.
- Logo visible.
- Primary CTA visible on desktop.
- Mobile menu should be full-screen or sheet with clear focus handling.

Dashboard sidebar:

- Deep purple identity.
- Role-filtered groups.
- Active state must be visible.
- Collapsed state must preserve tooltips or accessible labels.
- Footer user menu stays anchored.

Breadcrumbs:

- Use for deep dashboard pages.
- Put back links near page title for detail/update flows.

### Dialogs, Drawers, Popovers

Use dialogs for:

- Confirmation.
- Focused small forms.
- Critical review before irreversible action.

Use drawers for:

- Mobile filters.
- Secondary detail preview.
- Multi-field side editing if context should remain visible.

Use inline expansion for:

- Simple reveal.
- FAQ.
- Row details.
- Non-critical optional fields.

## Public Page Patterns

### Homepage Hero

Goal: immediate Tax Center Gunadarma signal plus clear brevet offer.

Structure:

- Brand or offer as H1.
- Supporting copy under 75ch.
- Primary CTA: daftar or lihat jadwal.
- Secondary CTA: validasi sertifikat or lihat program.
- Hint of next section visible in first viewport.
- Optional real image or editorial visual if high quality.

Avoid:

- Abstract gradient hero.
- Fake app screenshot.
- Metrics without source.
- Split card layout that feels like template SaaS.

### Program And Course Pages

Must show:

- Program name.
- Class type.
- Schedule.
- Registration period.
- Price by group where relevant.
- Quota or availability.
- What participant gets.
- CTA.

Use layout:

- Main narrative column.
- Sticky enrollment summary on desktop.
- Collapsed purchase summary on mobile.

### Schedule Pages

Must support scanning.

Use:

- Table on desktop.
- List summaries on mobile.
- Filters for program type or class mode if data grows.
- Clear empty state.

### Certificate Validation

Must feel official.

Use:

- Calm centered validation form.
- Certificate result with certificate number, participant name, program, issue date, status, and verification signal.
- Strong invalid state with guidance.
- Avoid celebratory visuals that reduce seriousness.

### Blog And Help

Use editorial reading patterns:

- Comfortable line length.
- Proper headings.
- Table of contents only when article is long.
- No cramped prose.

## Dashboard Page Patterns

### Dashboard Home

Role-aware:

- Admin sees revenue, pending payments, batch health, teacher workload, certificate stats, recent activity.
- Guru sees assigned classes, upcoming teaching tasks, grading needs.
- Siswa sees active programs, upcoming assignments, upcoming quizzes, payment status, certificate progress.

Do not show all roles the same generic cards.

### Management List Pages

Layout:

- Page header with title and primary action.
- Search/filter row.
- Data table.
- Pagination.

State order:

- Skeleton while loading.
- Error with retry.
- Empty state with next action.
- Populated table.

### Create And Update Pages

Layout:

- Back link or breadcrumb.
- Clear page title.
- Form grouped by meaning.
- Sticky footer or stable action row for long forms.

Rules:

- Do not bury submit button below excessive content without sticky support.
- Show destructive actions separately.
- Validate before submit and surface backend errors.

### Builder Pages

Builder screens should make structure visible.

Use:

- Left or top outline of course, batch, meetings.
- Main editing surface.
- Status per item.
- Inline add actions.
- Drag or reorder only if implementation supports it safely.

### Learning Workspace

Student class workspace should answer:

- Where am I in the course?
- What is available now?
- What is locked?
- What is due soon?
- What is completed?

Use:

- Meeting timeline.
- Content groups: materials, assignments, quizzes.
- Progress indicator.
- Locked state with reason.

### Quiz Attempt

Quiz taking must reduce anxiety.

Use:

- Stable question layout.
- Clear timer if timed.
- Save/submission state.
- Question navigation.
- Confirmation before final submit.
- Auto-submit messaging when relevant.

Avoid:

- Animations during answering.
- Layout shifts between questions.
- Hidden submit state.

### Grading

Teacher grading must be efficient.

Use:

- Submission content visible.
- Student identity visible.
- Score input close to feedback.
- Previous score or status visible.
- Next/previous navigation if batch grading exists.

## Motion

Motion principle: state and orientation, not decoration.

### Easing

Use:

```ts
const easeOutExpo = [0.16, 1, 0.3, 1];
```

### Durations

| Motion | Duration |
|---|---:|
| Button hover | `120ms` to `180ms` |
| Menu open | `160ms` to `220ms` |
| Sheet/drawer | `220ms` to `280ms` |
| Public reveal | `450ms` to `700ms` |
| Card hover | `180ms` to `260ms` |
| Toast | default Sonner |

Rules:

- Animate transform and opacity.
- Do not animate layout properties.
- Respect `prefers-reduced-motion`.
- Public scroll reveal may replay when useful.
- Dashboard should not have choreographed page entrance.

## Imagery And Assets

Use available assets:

- `/logo-tc.png`
- `/logo-dark-tc.png`
- `/brevet/brevet-1.jpg`
- `/brevet/brevet-2.jpg`
- `/brevet/brevet-3.jpg`
- `/brevet/brevet-4.jpg`
- `/placeholder.jpeg`
- `/errors/*.png`
- `/errors/*.gif`
- `/excel-templates/quiz_pg_mock.xlsx`
- `/excel-templates/quiz_tf_mock.xlsx`

Guidelines:

- Use real learning, class, certificate, document, or Tax Center imagery where possible.
- Avoid generic stock photos of laptops with coffee.
- Course images should have stable aspect ratio.
- Never let image loading change card height.
- Use fallback image component where existing code provides it.
- Use alt text that describes content, not file names.

## Iconography

Use `lucide-react` for UI icons.

Rules:

- Icon stroke width should feel consistent.
- Icon-only buttons need accessible labels and tooltips.
- Do not mix many icon families in one surface.
- Use icons to clarify actions, not decorate every heading.

## Copy Rules

Primary language: Indonesian.

Tone:

- Direct.
- Calm.
- Specific.
- Professional.

Button verbs:

- `Daftar`
- `Masuk`
- `Lihat Jadwal`
- `Lihat Detail`
- `Upload Bukti`
- `Konfirmasi`
- `Simpan`
- `Batalkan`
- `Kirim Jawaban`
- `Mulai Quiz`
- `Import Soal`
- `Tambah Pertemuan`

Empty states:

- Say what is missing.
- Say why it matters when helpful.
- Provide next action when user has permission.

Error states:

- Say what failed.
- Offer retry or next step.
- Avoid blaming user.

Avoid:

- Marketing filler.
- Overly playful phrases.
- English labels unless technical or already part of domain.
- Em dashes.

## Responsive Behavior

Breakpoints:

| Breakpoint | Width | Behavior |
|---|---:|---|
| `sm` | `640px` | Small cards can become 2 columns |
| `md` | `768px` | Public headers can split into text and action |
| `lg` | `1024px` | Dashboard sidebar and multi-column layouts |
| `xl` | `1280px` | Max public content width |
| `2xl` | `1536px` | Optional wide dashboard tables |

Rules:

- Mobile first.
- Text must not overflow buttons.
- Tables need horizontal scroll, column priority, or responsive cards.
- Sticky elements must not cover content.
- Dialogs should become drawers or full-width sheets on small screens when needed.
- Hero must reveal hint of next section on mobile and desktop.

## Accessibility

Minimum:

- WCAG 2.2 AA.
- Visible focus.
- Keyboard navigable menus, dialogs, forms, tabs, tables.
- Reduced motion support.
- Sufficient contrast.
- Form labels tied to inputs.
- Error messages associated with fields.
- Toasts should not be only place where critical info appears.
- Color not sole indicator.
- Dialogs trap focus and close through Escape.

Special care:

- Orange on light background is poor for small text. Use it for large text, buttons, icons, or accents.
- Purple sidebar needs high contrast white text.
- Status badge text must stay readable.
- Certificate validation must be understandable to non-technical visitors.

## Loading, Empty, Error, Disabled

Every interactive or data-driven surface needs these states.

### Loading

- Use skeletons for cards, tables, details, and dashboard panels.
- Keep final layout dimensions close to loaded state.
- Use spinner only for small inline actions.

### Empty

- Explain what is empty.
- Include action if user can create something.
- Use a calm visual, not a giant illustration unless it helps.

### Error

- Show concise problem.
- Provide retry or back action.
- Preserve user-entered form data where possible.

### Disabled

- Explain disabled reason for locked learning content, unavailable payment actions, or certificate eligibility.
- Do not use disabled button alone when reason is not obvious.

## Dark Mode

Default theme: light.

Dark mode is supported, but not primary. It should:

- Preserve orange primary action.
- Keep dashboard usable.
- Avoid pure black.
- Keep purple sidebar coherent.
- Reduce heavy shadows.
- Maintain chart contrast.

Do not design public pages as dark-first unless a specific campaign requires it.

## Data Visualization

Use Recharts for dashboard analytics.

Rules:

- Use restrained chart palette.
- Label axes clearly.
- Use tooltips.
- Avoid rainbow charts.
- Use orange for primary metric only.
- Use purple or blue for secondary comparison.
- Use tables next to charts when exact data matters.

Admin dashboard charts should prioritize:

- Revenue trend.
- Payment status.
- Batch health.
- Teacher workload.
- Certificate stats.
- Recent activity.

## Implementation Notes

Current design stack:

- Tailwind CSS v4 in `app/globals.css`.
- shadcn/ui new-york style.
- CSS variables for theme tokens.
- Plus Jakarta Sans through `next/font/google`.
- Framer Motion for public motion and interactive reveal.
- `tw-animate-css` available.
- `next-themes` for dark mode.
- Sonner for toast.
- Lucide icons.

When adding UI:

- Reuse components in `components/ui`.
- Reuse domain patterns in `components/(main)` and `components/(dashboard)`.
- Prefer utility classes over new CSS files unless component complexity requires it.
- Keep CSS variable names aligned with existing Tailwind theme.
- Do not introduce another component library.

## Page Acceptance Checklist

Before finalizing a public page:

- Brand or product signal visible in first viewport.
- Primary user action visible.
- Real content shown, not decorative filler.
- Next section hint visible.
- Mobile composition checked.
- No generic SaaS hero pattern.
- No gradient text or blobs.
- Images have stable size and alt text.
- Motion respects reduced motion.

Before finalizing a dashboard page:

- Header, primary action, filters, and content hierarchy clear.
- Loading, empty, error, disabled states handled.
- Table columns readable.
- Actions are predictable.
- Form validation visible.
- Role permission state considered.
- Mobile behavior acceptable.
- Keyboard focus visible.

## Design Debt To Avoid

- Mixing `rounded-2xl` everywhere with dense admin tables.
- Using orange as decoration rather than action.
- Making dashboard stats look like public hero metrics.
- Hiding important state inside tiny badges.
- Reusing public landing card style inside admin forms.
- Making every page start with the same card grid.
- Adding animation to every scroll section.
- Writing English microcopy in Indonesian flows.
- Letting long Indonesian labels overflow.
- Adding new routes without adding navigation and empty states.
