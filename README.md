# Frontend Brevet

Frontend Brevet is the Next.js frontend for Tax Center Brevet LMS, the official online learning and certification platform for Tax Center Universitas Gunadarma.

It provides the public program website, authentication flows, role-based dashboards, course and batch management, payment workflows, assignments, quizzes, grading, attendance, testimonials, blog management, and certificate validation UI.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui new-york style
- Radix UI primitives
- Lucide React icons
- TanStack Query
- TanStack Table
- Axios
- React Hook Form
- Zod
- Framer Motion
- Recharts
- TipTap editor
- next-themes
- Sonner
- React Dropzone

## Product And Design Context

Read these before making UI changes:

- `PRODUCT.md`: product strategy, users, routes, roles, feature map, copy rules, AI-agent rules.
- `DESIGN.md`: design system, visual direction, colors, typography, layout, components, motion, accessibility.

This LMS should not feel like a generic course template. Public pages target premium editorial craft. Dashboard pages target calm, dense, reliable operations.

## Requirements

- Node.js 20 or newer recommended
- npm
- Backend Brevet running locally or reachable over network

Local backend default:

```text
http://localhost:8083/api/v1
```

Backend health check:

```text
http://localhost:8083/hello
```

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local` in `frontend-brevet`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8083/api/v1
NEXT_PUBLIC_ASSET_URL=http://localhost:8083
```

Optional explicit dev and production values:

```env
NEXT_PUBLIC_API_URL_DEV=http://localhost:8083/api/v1
NEXT_PUBLIC_API_URL_PROD=https://be-brevet.taxcenterug.com/api/v1
NEXT_PUBLIC_ASSET_URL_DEV=http://localhost:8083
NEXT_PUBLIC_ASSET_URL_PROD=https://be-brevet.taxcenterug.com
```

Resolution behavior lives in `helpers/api-config.ts`.

## Run

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build production bundle:

```bash
npm run build
```

Start production server after build:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## Docker Production Deploy

Frontend production berjalan sebagai Next.js standalone server di port container `3000`.

Siapkan env production:

```bash
cp .env.production.example .env.production
nano .env.production
```

Minimal isi `.env.production` untuk VPS:

```env
NEXT_PUBLIC_SITE_URL=https://brevet.taxcenterug.com
NEXT_PUBLIC_API_URL=https://be-brevet.taxcenterug.com/api/v1
NEXT_PUBLIC_ASSET_URL=https://be-brevet.taxcenterug.com
FRONTEND_HOST_PORT=3000
```

Build dan jalankan container:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Cek status:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production ps
docker logs -f frontend-brevet-web
```

Restart setelah update kode atau env `NEXT_PUBLIC_*`:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Catatan VPS Hostinger:

- Service expose hanya ke `127.0.0.1:${FRONTEND_HOST_PORT:-3000}` agar aman di belakang reverse proxy.
- Arahkan Nginx/Apache reverse proxy domain frontend ke `http://127.0.0.1:3000`.
- Jika nilai `NEXT_PUBLIC_*` berubah, wajib rebuild image karena Next.js menanam nilai ini saat `next build`.
- Backend production default diarahkan ke `https://be-brevet.taxcenterug.com`.

## Account Setup

Default seeded accounts:

```text
Admin:   admin@brevet.local / Admin123!
Teacher: guru@brevet.local / Guru123!
Student: siswa@brevet.local / Siswa123!
```

## Project Structure

```text
frontend-brevet
|-- app
|   |-- (main)              Public website routes
|   |-- auth                Sign in, sign up, verify
|   |-- dashboard           Authenticated role-based app
|   |-- globals.css         Tailwind v4 tokens and global styles
|   |-- layout.tsx          Root providers, font, metadata
|   `-- not-found.tsx
|-- components
|   |-- (main)              Public website components
|   |-- (dashboard)         Dashboard domain components
|   |-- auth                Auth forms and schemas
|   |-- minimal-tiptap      Rich text editor
|   |-- ui                  shadcn/ui primitives
|   |-- app-sidebar.tsx
|   |-- nav-main.tsx
|   |-- nav-management.tsx
|   |-- nav-secondary.tsx
|   `-- nav-user.tsx
|-- helpers
|   |-- api-config.ts       API and asset URL resolution
|   `-- axios-instance.ts   Axios client and token refresh
|-- hooks                  API and UI hooks
|-- lib
|   `-- data
|       `-- route-items.tsx Dashboard nav definitions
|-- providers              Theme and TanStack providers
|-- public                 Logos, static images, error assets, templates
|-- PRODUCT.md
|-- DESIGN.md
|-- components.json
|-- package.json
`-- tsconfig.json
```

## Route Map

### Public Routes

```text
/
/program/[slug]
/kursus/[slug]
/workshop/[slug]
/jadwal-program
/jadwal-workshop
/berita
/berita/[slug]
/sertifikat
/sertifikat/[id]
/umpan-balik
/bantuan
/pembayaran/[batchSlug]
```

### Auth Routes

```text
/auth/sign-in
/auth/sign-up
/auth/verify
```

### Dashboard Routes

```text
/dashboard
/dashboard/profile
/dashboard/admin
/dashboard/admin/create
/dashboard/admin/[id]
/dashboard/admin/[id]/update
/dashboard/pengajar
/dashboard/pengajar/create
/dashboard/pengajar/[id]
/dashboard/pengajar/[id]/update
/dashboard/peserta
/dashboard/peserta/[id]
/dashboard/peserta/[id]/update
/dashboard/kursus
/dashboard/kursus/tambah
/dashboard/kursus/[slug]/update
/dashboard/kursus/[slug]/builder
/dashboard/kursus/[slug]/gelombang
/dashboard/kursus/[slug]/gelombang/tambah
/dashboard/kursus/[slug]/gelombang/[batchSlug]/update
/dashboard/kursus/[slug]/gelombang/[batchSlug]/builder
/dashboard/kursus/[slug]/gelombang/[batchSlug]/absensi
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/tambah
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/update
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/materi
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/materi/tambah
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/tugas
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/tugas/tambah
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/quiz
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/quiz/tambah
/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan/[pertemuanId]/quiz/[quizId]/upload
/dashboard/kelas
/dashboard/kelas/[slug]
/dashboard/kelas/[slug]/materi
/dashboard/kelas/[slug]/tugas
/dashboard/kelas/[slug]/quiz
/dashboard/kelas/[slug]/nilai
/dashboard/program-saya
/dashboard/program-saya/[batchSlug]
/dashboard/program-saya/[batchSlug]/tugas/[assignmentId]
/dashboard/program-saya/[batchSlug]/tugas/[assignmentId]/kerjakan
/dashboard/program-saya/[batchSlug]/quiz/[quizId]
/dashboard/program-saya/[batchSlug]/quiz/[quizId]/kerjakan/[attemptId]
/dashboard/pembayaran
/dashboard/pembayaran/[id]
/dashboard/transaksi
/dashboard/transaksi/[id]
/dashboard/berita
/dashboard/berita/tambah
/dashboard/berita/[slug]/update
/dashboard/umpan-balik
```

## Core Modules

### Public Website

- Editorial homepage
- Featured programs
- Featured courses or batches
- Pricing
- FAQ
- Schedule pages
- Blog listing and detail
- Workshop detail
- Certificate validation
- Testimonials
- Help page

### Authentication

- Sign in
- Sign up
- Email verification
- Cookie-based access token
- Refresh token retry through Axios interceptor
- Redirect to sign in when refresh fails

### Admin Dashboard

- Dashboard analytics
- Admin management
- Teacher management
- Student/member management
- Course CRUD
- Batch CRUD
- Meeting CRUD
- Materials
- Assignments
- Quizzes
- Attendance
- Payments
- Transactions
- Blog management
- Testimonial management

### Teacher Dashboard

- Assigned classes
- Class meeting workspace
- Material management
- Assignment management
- Quiz management
- Question import
- Grading
- Student score review

### Student Dashboard

- My programs
- Course progress
- Meeting content
- Materials access
- Assignment submission
- Quiz attempt
- Quiz result
- Payment tracking
- Profile update
- Certificate access

## API Patterns

Use existing hooks where possible:

- `use-get-data.tsx`
- `use-get-infinite-data.ts`
- `use-post-data.tsx`
- `use-put-data.tsx`
- `use-patch-data.tsx`
- `use-delete-data.tsx`
- `use-file-uploader.ts`
- `use-data-table-query-params.ts`
- `use-decoded-token.tsx`

Axios behavior:

- Base URL from `API_BASE_URL`.
- `withCredentials: true`.
- Bearer token from `access_token` cookie.
- Refreshes through `/auth/refresh-token` on 401.
- Redirects to `/auth/sign-in` if refresh fails.
- Supports `x-unauth-ok` header for unauthenticated-tolerant calls.

Asset behavior:

- `toAssetUrl` maps backend `/uploads` paths to asset base URL.
- Public static files live under `public`.

## UI Conventions

- Use shadcn/ui primitives from `components/ui`.
- Use lucide icons for action buttons and navigation.
- Use Plus Jakarta Sans.
- Use Indonesian copy by default.
- Public CTAs can use pill buttons.
- Dashboard buttons, panels, forms, and tables should stay compact and precise.
- Use skeletons for loading content.
- Use Sonner for non-critical feedback.
- Do not use toast as the only critical error display.
- Keep empty, loading, error, disabled, and permission states explicit.

## Design Rules

See `DESIGN.md` for full detail. Short version:

- Official before flashy.
- Public pages can be expressive.
- Dashboard pages must be calm and fast.
- Orange means action.
- Purple means institutional identity.
- No gradient text.
- No decorative glassmorphism.
- No blobs, orbs, particles, or fake AI decoration.
- No nested cards.
- No generic LMS card grids.
- No dark-mode-first design.

## Static Assets

Important assets:

```text
public/logo-tc.png
public/logo-dark-tc.png
public/brevet/brevet-1.jpg
public/brevet/brevet-2.jpg
public/brevet/brevet-3.jpg
public/brevet/brevet-4.jpg
public/placeholder.jpeg
public/errors/access-denied.png
public/errors/access-denied.gif
public/errors/coming-soon.gif
public/errors/maintenance.png
public/errors/not-found.png
public/errors/not-found.gif
public/excel-templates/quiz_pg_mock.xlsx
public/excel-templates/quiz_tf_mock.xlsx
```

## Development Notes

- The app uses App Router and many client components for forms, dashboards, and interactions.
- Keep new domain code near existing domain folders.
- Avoid adding another state management library unless there is a clear need.
- Keep backend contract names consistent with existing hooks and types.
- Prefer server-safe code in route files, then client components for interactive parts.
- Use existing schemas in `_schemas` folders as examples.
- Use existing `_types` folders for domain typing.

## Quality Checklist

Before opening a PR or handing work back:

- `npm run build` passes when backend-independent.
- Main route renders without hydration warnings.
- Forms validate client-side and show backend errors.
- Protected route behavior handles expired tokens.
- Loading, empty, error, and disabled states exist.
- Text does not overflow on mobile.
- Tables stay usable on small screens.
- Focus states are visible.
- Reduced motion is respected.
- Public pages keep Tax Center Gunadarma identity visible.
