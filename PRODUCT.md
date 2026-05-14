# Product

## Register

product

## Product Name

Tax Center Brevet LMS

## Owner

Tax Center Universitas Gunadarma

## Product Summary

Tax Center Brevet LMS is the official learning, enrollment, payment, assessment, and certificate platform for brevet tax training at Tax Center Universitas Gunadarma. It connects public learners, Gunadarma students, teachers, and administrators in one end-to-end workflow: discover programs, register, pay, attend meetings, access materials, submit assignments, take quizzes, receive grades, track completion, and validate certificates.

This is not a generic edtech product. It carries institutional trust, tax-professional seriousness, and campus accessibility. The interface must feel sharper than a normal LMS, but still task-first. The target quality is award-level digital craft for the public surface and best-in-class operational clarity for the dashboard.

## Primary Surfaces

### Public Surface

Routes under `app/(main)` are the public brand and conversion layer.

- `/`: homepage for program discovery, credibility, pricing, FAQ, and primary registration paths.
- `/program/[slug]`: program detail for course family explanation.
- `/kursus/[slug]`: course or batch detail with enrollment decision support.
- `/workshop/[slug]`: workshop detail.
- `/jadwal-program`: schedule table for brevet classes.
- `/jadwal-workshop`: schedule table for workshops.
- `/berita`: public article listing.
- `/berita/[slug]`: article detail.
- `/sertifikat`: certificate validation entry.
- `/sertifikat/[id]`: certificate validation result.
- `/umpan-balik`: testimonials and student feedback.
- `/bantuan`: help and support.
- `/pembayaran/[batchSlug]`: payment flow after selecting a batch.

### Auth Surface

Routes under `app/auth` handle account creation and sign-in.

- `/auth/sign-in`: login for all roles.
- `/auth/sign-up`: registration for students or public participants.
- `/auth/verify`: email verification with OTP.

### Product Surface

Routes under `app/dashboard` are the authenticated application.

- `/dashboard`: role-aware dashboard summary.
- `/dashboard/kursus`: course management.
- `/dashboard/kursus/[slug]/builder`: course builder.
- `/dashboard/kursus/[slug]/gelombang`: batch management.
- `/dashboard/kursus/[slug]/gelombang/[batchSlug]/builder`: batch builder.
- `/dashboard/kursus/[slug]/gelombang/[batchSlug]/pertemuan`: meeting management.
- `/dashboard/kursus/[slug]/gelombang/[batchSlug]/absensi`: attendance management.
- `/dashboard/kelas`: teacher class list.
- `/dashboard/kelas/[slug]`: teacher class workspace.
- `/dashboard/program-saya`: student enrolled program list.
- `/dashboard/program-saya/[batchSlug]`: student class workspace.
- `/dashboard/transaksi`: transaction management.
- `/dashboard/pembayaran`: student payment tracking.
- `/dashboard/pengajar`: teacher management.
- `/dashboard/peserta`: student/member management.
- `/dashboard/admin`: admin management.
- `/dashboard/berita`: article management.
- `/dashboard/umpan-balik`: testimonial management.
- `/dashboard/profile`: profile update.

## Users

### Student: Siswa

Students use the LMS to choose a program, pay, learn, submit work, take quizzes, monitor progress, and download certificates. They may be Gunadarma students, non-Gunadarma students, or general public learners. Each group can have different pricing and eligibility context.

Student mindset:

- Wants clear next action.
- Wants confidence that payment and enrollment are valid.
- Needs low-friction access to meetings, materials, assignments, quizzes, scores, and certificates.
- May use mobile often for checking schedules or payments.
- Needs Indonesian copy that is direct and calm.

Student success:

- Finds correct program quickly.
- Understands price and schedule before registering.
- Completes payment without confusion.
- Knows which meeting, task, or quiz is next.
- Can prove certificate validity through public verification.

### Teacher: Guru or Pengajar

Teachers manage assigned classes and meeting content. They create or update materials, assignments, quizzes, grade submissions, review quiz attempts, and monitor student progress.

Teacher mindset:

- Wants fast class access.
- Works with repeated operational tasks.
- Needs dense but readable tables.
- Needs batch and meeting context visible at all times.
- Wants grading flows that reduce friction.

Teacher success:

- Finds assigned class instantly.
- Adds material or task with minimal steps.
- Imports quiz questions through Excel.
- Grades submissions reliably.
- Sees enough student context before grading.

### Administrator

Administrators manage the full platform: users, courses, batches, payments, schedules, blog posts, testimonials, attendance, certificates, and analytics.

Admin mindset:

- Needs control, auditability, and speed.
- Works across many records.
- Needs search, filters, status badges, and stable tables.
- Must trust that destructive or irreversible actions are obvious.

Admin success:

- Confirms payments accurately.
- Creates course and batch structures without broken sequencing.
- Tracks revenue, pending payments, certificates, progress, and teacher workload.
- Maintains public content without developer support.

### Public Visitor

Public visitors are prospective participants, parents, alumni, or employers validating certificates.

Visitor mindset:

- Evaluates credibility quickly.
- Needs official Gunadarma signal.
- Wants schedule, price, class format, and certificate value.
- May arrive from social media or direct link.

Visitor success:

- Understands what Tax Center Brevet offers within the first screen.
- Finds a relevant batch or workshop.
- Trusts the institution enough to register.
- Can validate certificate authenticity.

## Jobs To Be Done

- When I want to improve my tax competency, I need to compare brevet programs and schedules so I can choose the right class.
- When I decide to join, I need a clear registration and payment path so I know my seat is secured.
- When I am enrolled, I need a focused learning workspace so I can attend meetings, read material, submit work, and take quizzes without hunting through menus.
- When I teach a class, I need a structured class workspace so I can manage content and grading with fewer repeated clicks.
- When I administer programs, I need trustworthy operational views so I can manage many users, batches, payments, and certificates with confidence.
- When I verify a certificate, I need a public validation flow so I can confirm the certificate is legitimate.

## Product Purpose

The LMS exists to make brevet tax training operationally reliable, institutionally credible, and easier to complete. It replaces scattered manual workflows with one structured system for learning delivery, assessment, payment, and certification.

The product must:

- Increase successful program registration.
- Reduce payment confusion.
- Reduce admin manual work.
- Make learning progress visible.
- Make assignments and quizzes easier to manage.
- Make certificate issuance and validation credible.
- Preserve Tax Center Universitas Gunadarma identity.

## Business Goals

- Support official brevet program delivery for Tax Center Universitas Gunadarma.
- Convert public visitors into registered participants.
- Support multiple learner groups and pricing rules.
- Enable online and offline batch operations.
- Centralize records for payments, attendance, scoring, and certificates.
- Improve perceived quality of the Tax Center digital presence.

## Product Principles

### 1. Official Before Flashy

The product represents a university-backed tax education institution. Visual craft can be bold, but credibility wins over decoration. Every screen must feel legitimate, maintained, and accountable.

### 2. Learning Path Must Be Obvious

Students should always know their next action: register, pay, open material, submit assignment, take quiz, review score, or request certificate. Never make learners infer workflow from raw navigation alone.

### 3. Operations Need Density With Calm

Admin and teacher screens should support repeated work. Tables, forms, filters, and actions can be dense, but hierarchy must stay clean. Important state should be visible without visual shouting.

### 4. Public Surface Can Be Memorable

The landing and program pages should feel distinctive enough to avoid LMS boredom. Use editorial structure, strong typography, real institutional imagery, confident spacing, and tactile micro-interactions. Avoid generic SaaS hero formulas.

### 5. State Is More Important Than Ornament

Payment status, enrollment status, quiz state, assignment due state, attendance state, and certificate eligibility are core UX. Design must make these states unmistakable.

### 6. Indonesian First

Primary copy is Indonesian. Labels, errors, empty states, buttons, and helper text should sound natural in Indonesian, not translated word-for-word from English.

### 7. Trust Through Specificity

Prefer concrete details over vague claims: schedule dates, quotas, price groups, meeting count, teacher names, certificate numbers, payment deadlines, and verification result details.

## Brand Personality

Three words:

- Cerdas
- Resmi
- Progresif

Tone:

- Professional but not cold.
- Clear but not childish.
- Encouraging but not salesy.
- Institutional but not bureaucratic.
- Sharp enough for a modern university digital product.

Voice examples:

- Use: `Mulai belajar brevet pajak dengan jalur resmi Tax Center Universitas Gunadarma.`
- Use: `Pembayaran menunggu konfirmasi admin. Kami akan memperbarui status setelah bukti transfer diverifikasi.`
- Use: `Belum ada tugas untuk pertemuan ini. Materi dapat dibaca terlebih dahulu.`
- Avoid: `Nikmati pengalaman belajar terbaik dengan fitur lengkap yang luar biasa.`
- Avoid: `Oops! Sepertinya tidak ada data nih.`

## Anti-References

Do not make this look like:

- Generic AI SaaS landing page with gradient blobs, glass cards, and floating fake dashboards.
- Boring LMS template with endless equal cards and weak hierarchy.
- Dark-mode-first crypto dashboard.
- Government portal with cramped tables and no visual rhythm.
- Startup landing page that hides the actual product behind abstract illustrations.
- Course marketplace that feels unaffiliated with Gunadarma.
- Over-animated Awwwards page that slows down task completion.
- Bootstrap admin panel with random badge colors and inconsistent forms.
- Template UI where every section is icon plus title plus paragraph.

Specific banned patterns:

- Gradient text.
- Decorative glassmorphism.
- Large colored side stripes on cards or alerts.
- Identical card grids for every content block.
- Hero metric template.
- Unmotivated 3D objects.
- Decorative blobs, orbs, particles, and bokeh.
- Full-screen loader choreography.
- Modal as the first answer for every action.
- Low-contrast orange body text.
- Purple and orange everywhere at the same intensity.

## Design Target

Public pages should be capable of Awwwards-level craft without becoming fragile or self-indulgent. That means:

- Real content visible above the fold.
- Strong editorial composition.
- Confident type scale.
- Memorable section transitions.
- Real Tax Center and learning assets where available.
- Micro-interactions that reward intent.
- No fake metrics unless backed by data.
- No decorative complexity that obscures program choice.

Dashboard pages should feel like a mature operational product:

- Dense, precise, and fast.
- State-rich.
- Role-aware.
- Keyboard friendly.
- Stable under long names and empty data.
- Familiar enough that admin users do not need training for basic tasks.

## Core Feature Map

### Authentication

- Register.
- Email OTP verification.
- Sign in.
- Access token and refresh token flow.
- Cookie-based token storage.
- API retry on 401 through refresh token.
- Role-based protected routes.
- Access denied page.

### Program Discovery

- Program catalog.
- Program detail.
- Course or batch detail.
- Workshop detail.
- Schedule views.
- Public FAQ.
- Public testimonials.
- Public blog.

### Enrollment And Payment

- Batch selection.
- Group-based price.
- Purchase creation.
- Payment proof upload.
- Payment status tracking.
- Admin payment confirmation.
- Receipt handling on backend.

### Course And Batch Management

- Course CRUD.
- Batch CRUD.
- Course builder.
- Batch builder.
- Schedule, quota, room, class type, allowed groups, and active days.
- Meeting sequencing.

### Learning Content

- Meeting list.
- Material upload and access.
- Assignment creation.
- Assignment submission with text or file.
- Quiz creation.
- Excel question import.
- Multiple choice and true or false questions.
- Temporary quiz answers.
- Manual and automatic quiz submission.

### Evaluation

- Grading with feedback.
- Excel export and import for grading.
- Attendance bulk update.
- Score tracking.
- Quiz results.
- Course progress.

### Certification

- Certificate eligibility after completion.
- Certificate generation on backend.
- Public certificate verification.
- Certificate detail result page.

### Content Management

- Blog CRUD.
- Testimonial management.
- Help page content.

## Role Permissions Model

### Admin

Admin can manage:

- Users.
- Teachers.
- Students.
- Courses.
- Batches.
- Meetings.
- Materials.
- Assignments.
- Quizzes.
- Attendance.
- Payments.
- Transactions.
- Blog posts.
- Testimonials.
- Dashboards and analytics.

### Guru

Teacher can manage assigned:

- Classes.
- Meetings.
- Materials.
- Assignments.
- Quizzes.
- Grades.
- Student progress views.

### Siswa

Student can manage own:

- Profile.
- Purchases.
- Payments.
- Enrolled programs.
- Materials access.
- Assignment submissions.
- Quiz attempts.
- Scores.
- Certificates.
- Testimonials.

## Data And API Assumptions

Frontend communicates with backend REST API under `/api/v1`.

Development defaults:

```env
NEXT_PUBLIC_API_URL_DEV=http://localhost:8083/api/v1
NEXT_PUBLIC_ASSET_URL_DEV=http://localhost:8083
```

Production defaults:

```env
NEXT_PUBLIC_API_URL_PROD=https://be-brevet.tcugapps.com/api/v1
```

API helpers:

- `helpers/api-config.ts` resolves dev, production, and explicit environment URLs.
- `helpers/axios-instance.ts` sets `withCredentials: true`, applies bearer token from cookie, refreshes access token on 401, and redirects to `/auth/sign-in` when refresh fails.
- `toAssetUrl` maps `/uploads` paths to backend asset base URL.

List endpoints commonly support:

- `q`: search keyword.
- `sort`: sort field.
- `order`: `asc` or `desc`.
- `select`: comma-separated fields.
- `limit`: page size.
- `page`: page number.

## Information Architecture

### Public Navigation

Primary public nav should prioritize:

- Beranda.
- Program.
- Jadwal.
- Workshop.
- Berita.
- Sertifikat.
- Bantuan.
- Masuk or Dashboard depending auth state.

### Dashboard Navigation

Dashboard nav is role-filtered through `lib/data/route-items.tsx` and filtering hooks:

- `use-filter-nav-main.ts`
- `use-filter-nav-management.ts`

Core groups:

- Beranda.
- Manajemen Pengguna.
- Kursus.
- Manajemen Kursus.
- Manajemen Pembayaran.
- Manajemen Transaksi.
- Manajemen Kelas.
- Bantuan.
- Umpan Balik.

## Content Strategy

### Public Pages

Lead with specific value:

- Official Tax Center Gunadarma context.
- Brevet tax competency.
- Practical curriculum.
- Online or offline class modes.
- Clear schedule and price.
- Certificate credibility.

Avoid vague value props:

- `Belajar lebih mudah.`
- `Platform lengkap untuk semua kebutuhan.`
- `Solusi terbaik untuk masa depan.`

### Dashboard

Use action-oriented labels:

- `Tambah Kursus`
- `Upload Bukti`
- `Konfirmasi Pembayaran`
- `Tambah Pertemuan`
- `Import Soal`
- `Nilai Jawaban`

Use state labels that are exact:

- `Menunggu Pembayaran`
- `Menunggu Konfirmasi`
- `Dibayar`
- `Kedaluwarsa`
- `Dibatalkan`
- `Belum Dinilai`
- `Sudah Dinilai`
- `Sedang Berlangsung`
- `Selesai`

## Accessibility And Inclusion

Target:

- WCAG 2.2 AA for contrast, focus, keyboard navigation, and reduced motion.

Requirements:

- All interactive elements reachable by keyboard.
- Clear focus rings on buttons, links, inputs, selects, tabs, dialogs, and menus.
- Do not rely on color alone for status.
- Status badges must include text.
- Errors must be placed near fields and announced where possible.
- Loading states must preserve layout size.
- Motion must respect `prefers-reduced-motion`.
- Tables must remain readable on small screens through horizontal scroll, column priority, or responsive summaries.
- Indonesian labels should be clear for non-technical users.

## Performance Expectations

- Public pages should feel fast on mid-range mobile devices.
- Use Next image optimization where possible.
- Avoid heavy animation libraries for trivial effects beyond current Framer Motion usage.
- Avoid page-load animation sequences that delay content.
- Dashboard tables should paginate, filter, and skeleton-load without jumping.
- Large editor or chart components should stay isolated to pages that need them.

## Tech Stack

- Next.js 15 with App Router.
- React 19.
- TypeScript.
- Tailwind CSS v4.
- shadcn/ui new-york style.
- Radix UI primitives.
- Lucide icons.
- TanStack Query.
- TanStack Table.
- Axios.
- React Hook Form.
- Zod.
- Framer Motion.
- Recharts.
- TipTap editor.
- next-themes.
- Sonner toasts.
- React Dropzone.

## File Conventions

- Public pages live in `app/(main)`.
- Dashboard pages live in `app/dashboard`.
- Auth pages live in `app/auth`.
- Domain components live in `components/(main)` and `components/(dashboard)`.
- Reusable primitives live in `components/ui`.
- API hooks live in `hooks`.
- API URL helpers live in `helpers`.
- Role route definitions live in `lib/data/route-items.tsx`.
- Rich text editor lives in `components/minimal-tiptap`.
- Static assets live in `public`.
- Excel templates live in `public/excel-templates`.

## Build And Run

Frontend:

```bash
cd frontend-brevet
npm install
npm run dev
npm run build
```

Backend:

```bash
cd backend-brevet
docker compose up -d --build
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8083/api/v1`
- Backend health: `http://localhost:8083/hello`

## Seed Accounts

Default backend seed accounts:

```text
Admin: admin@brevet.local / Admin123!
Teacher: guru@brevet.local / Guru123!
Student: siswa@brevet.local / Siswa123!
```

## Definition Of Done For AI Agents

Before changing UI:

- Read `PRODUCT.md`.
- Read `DESIGN.md`.
- Confirm whether target surface is public, auth, or dashboard.
- Preserve Indonesian-first copy.
- Preserve role-aware behavior.
- Use existing shadcn, Radix, Tailwind, TanStack, and helper patterns.
- Prefer existing hooks and helpers over new client code.
- Check loading, empty, error, disabled, and permission states.
- Keep route and module names consistent with existing repository.
- Avoid banned visual patterns from `DESIGN.md`.

Before shipping:

- Run `npm run build` when possible.
- Check responsive behavior.
- Check keyboard focus.
- Check text overflow on mobile.
- Check API base URL assumptions.
- Check that protected actions handle expired token state.
