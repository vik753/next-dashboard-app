# GitHub Copilot — Shared Base Instructions

These instructions apply to **all agents** in this repository. Each agent also
has its own role-specific file in `.github/agents/`.

---

## Stack
Next.js App Router · TypeScript · Tailwind CSS · `postgres` (raw SQL, no ORM) ·
NextAuth.js v5 (beta) · Zod · pnpm · Vitest · Playwright

## Key Paths
| Path | Purpose |
|------|---------|
| `app/lib/data.ts` | All DB reads — Server Components only |
| `app/lib/actions.ts` | All DB writes — `"use server"` actions |
| `app/lib/definitions.ts` | TypeScript types (hand-written) |
| `app/lib/utils.ts` | Formatting helpers |
| `app/ui/` | Reusable UI, organised by feature |
| `app/seed/route.ts` | DB seed route |
| `__tests__/` | Vitest unit/integration tests |
| `e2e/` | Playwright E2E tests |

## Non-Negotiable Rules
1. **Money in cents** — DB stores integers. Multiply ×100 on write, divide ÷100 on read.
2. **Search in URL** — never use React state for search/filter; use `?query=&page=`.
3. **`"use client"`** only when browser APIs are needed (`usePathname`, `useSearchParams`, `useRouter`).
4. **Server Actions** sequence: `"use server"` → `FormData.get()` → Zod `safeParse` → SQL → `revalidatePath` → `redirect`.
5. **Parallel fetches** with `Promise.all([...])` when queries are independent.
6. **Suspense boundaries** around every async data component; skeletons in `app/ui/skeletons.tsx`.
7. **Path alias** — always use `@/` from root.
8. **No ORM** — raw SQL via the `sql` tagged template from `postgres`.
9. **pnpm** — never use npm or yarn.
10. **Tailwind + clsx** — no inline `style` props unless unavoidable.

## Commit / Output Format
- Code changes only — no explanatory prose inside source files.
- TypeScript strict mode — no `any`, no implicit returns on non-void functions.
- Imports ordered: external packages → internal `@/` aliases → relative.

