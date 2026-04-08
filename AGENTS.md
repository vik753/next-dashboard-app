# AGENTS.md — Next.js Dashboard Codebase Guide

## Stack
Next.js App Router · TypeScript · Tailwind CSS · `postgres` (raw SQL, no ORM) · NextAuth.js v5 (beta) · Zod · pnpm

## Developer Workflows
```bash
pnpm dev          # dev server with Turbopack
pnpm build        # production build
pnpm lint         # ESLint
# Seed the database (requires POSTGRES_URL env var):
# GET http://localhost:3000/seed
```
There is no test suite. The `POSTGRES_URL` environment variable (with SSL) must be set for any database operation.

## Architecture Overview

```
app/
  lib/
    data.ts          # All DB reads — imported only by Server Components
    actions.ts       # All DB writes — "use server" Server Actions
    definitions.ts   # All TypeScript types (hand-written, no codegen)
    utils.ts         # Formatting helpers (currency, dates, pagination)
    placeholder-data.ts  # Seed data
  ui/                # Reusable UI, organized by feature (dashboard/, invoices/, customers/)
  seed/route.ts      # GET route that creates tables and seeds data
  query/route.ts     # Ad-hoc query utility route
  dashboard/
    (overview)/      # Route group — URL is /dashboard, not /dashboard/overview
```

## Critical Patterns

### Server vs. Client Components
- Pages and data-fetching components are Server Components by default.
- Add `"use client"` only when browser APIs are needed (e.g., `usePathname`, `useSearchParams`, `useRouter`). See `app/ui/search.tsx` and `app/ui/dashboard/nav-links.tsx`.

### Server Actions (`app/lib/actions.ts`)
All mutations follow this exact sequence:
1. `"use server"` directive at file top
2. Parse form fields with `FormData.get()`
3. Validate with Zod `safeParse` → return field errors on failure
4. Execute raw SQL via `sql\`...\``
5. Call `revalidatePath("/dashboard/invoices")` to bust cache
6. Call `redirect("/dashboard/invoices")` to navigate

### Money is Always Stored in Cents
DB columns store integers (cents). Convert before insert: `amount * 100`. Convert on read: `amount / 100`. `formatCurrency` in `utils.ts` handles display formatting (divides by 100 internally).

### Search State Lives in the URL
Search input uses URL search params (`?query=&page=`) rather than React state. `Search` component debounces with `useDebouncedCallback` (300 ms) and calls `router.replace(...)`. Page components read `searchParams` prop. See `app/ui/search.tsx` and `app/dashboard/invoices/page.tsx`.

### Streaming with Suspense
Each async data component is individually wrapped in `<Suspense fallback={<SkeletonComponent />}>`. Skeleton components live in `app/ui/skeletons.tsx`. The `Suspense` key is set to `query + currentPage` to force re-render on filter changes.

### Parallel Data Fetching
When multiple independent queries are needed (e.g., `fetchCardData`), use `Promise.all([...])` rather than sequential `await`. See `app/lib/data.ts`.

## Path Alias
Use `@/` to reference from the project root (e.g., `import { foo } from "@/app/lib/utils"`).

## Styling Conventions
- Tailwind utility classes throughout; `clsx` for conditional class merging.
- Fonts defined in `app/ui/fonts.ts` (`inter`, `lusitana`) and applied via `className={lusitana.className}`.
- Global styles in `app/ui/global.css`; CSS module in `app/ui/home.module.css`.

## Auth
`auth.config.ts` contains the NextAuth route-guard logic: any `/dashboard/**` route requires authentication; authenticated users hitting `/` are redirected to `/dashboard`. NextAuth v5 beta API — use `next-auth@5.0.0-beta.x` conventions.

## Database Schema (tables)
`users`, `customers`, `invoices`, `revenue` — all use UUIDs (via `uuid-ossp` extension). Schema defined in `app/seed/route.ts`.

