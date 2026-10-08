# বাজার দর (BazarDor) — project guide

Kawsar's Programming Hero **Assignment-7**. The full requirement list is in
`docs/ASSIGNMENT.md` — read it before building any feature and check your work against it.
`docs/BUILD-STEPS.md` is the order the work is meant to happen in.

## Who I am working with

Kawsar is an early-to-intermediate self-taught developer. Explain new concepts in **Bangla**,
step by step, with examples — but keep all code, file names and technical terms in English.
Explain *why*, not just *what*. Prefer clear, readable code over clever code.

## Tech stack (already in package.json — do not add more without asking)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · daisyUI 5 ·
BetterAuth · MongoDB (Atlas) · react-hot-toast

## Things that are easy to get wrong here

- **Store numbers, render Bengali digits.** Prices live in `src/data/products.json` as plain
  numbers. Convert only at render time with the helpers in `src/lib/bn.ts`
  (`formatPrice`, `formatChange`, `toBengaliDigits`). Never store "১৪৮" as a string — the sort
  dropdown (challenge C1) must compare numbers, and `Math.min`/`Math.max` must work.
- **Tailwind is v4, not v3.** There is no `tailwind.config.js` and no `content` array.
  Everything is configured inside `src/app/globals.css` with `@import 'tailwindcss'`,
  `@plugin 'daisyui'`, `@theme` and `@utility`.
- **The brand colours live in exactly one place** — the `@theme` block of `globals.css`
  (`--color-brand`, `--color-up`, `--color-down`, `--color-flat`). Use `text-brand`,
  `bg-up-soft` etc. Never hardcode a hex value in a component. Match these tokens to the
  Figma before submitting.
- **`banglaDate()` must run in `useEffect`**, inside a client component. Calling it during
  render on both server and client causes a React hydration mismatch, because the server and
  the browser can be on different days.
- **`cacheComponents` is deliberately off** in `next.config.ts`. Do not turn it on — with it
  on, every component that reads cookies (which BetterAuth session checks do) has to sit
  inside a Suspense boundary.
- **Run npm commands only in Kawsar's own VS Code terminal** on his Mac. `node_modules` was
  once installed from a Linux environment and the native binaries did not work on macOS.
- **Dynamic routes must survive a refresh on Vercel.** `/product/[slug]` and
  `/category/[slug]` are server-rendered App Router pages, which is fine — just never add
  `output: 'export'`, and always render a real `not-found` for an unknown slug rather than
  throwing.

## Data

- `src/data/products.json` — 26 products, each with `slug, emoji, name, category,
  categorySlug, unit, price, change, summary, tags, min, max, avg, bazars[]`.
- `src/data/categories.json` — 8 categories (`chal, shobji, mach, mangsho, dim, dal, tel, moshla`).
- `src/lib/products.ts` — typed async accessors (`getAllProducts`, `getProductBySlug`,
  `getTopRisers`, `getTopFallers`, `getProductsByCategory`, `getCategories`,
  `getCategoryBySlug`). They include a small artificial delay so the loading skeletons are
  actually visible — that is intentional.
- `src/lib/bn.ts` — Bengali digits, price formatting, change badge text, Bangla date.

## Conventions

- One component per file in `src/components/`, PascalCase names.
- Server components by default; add `'use client'` only where you need state or effects
  (sort dropdown, mobile menu, auth forms, the date line).
- Shared types come from `src/lib/products.ts` — do not redeclare them.
- No `any`.
- **All user-facing text is Bangla.** No lorem ipsum, no leftover English placeholder copy.
- Commit after each feature with a meaningful message (`feat:`, `fix:`, `style:`, `docs:`).

## Auth

BetterAuth with the MongoDB adapter, email/password plus Google and GitHub.
Env vars are listed in `.env.example`; real values go in `.env.local` (gitignored).
Do not implement email verification or password reset — the assignment explicitly says not to.
Show a react-hot-toast on sign in, sign up, sign out, validation errors and protected-route
redirects.
