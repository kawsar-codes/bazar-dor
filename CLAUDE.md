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

- **Data comes from the assignment's API, not a local file.** Always go through
  `src/lib/api.ts` — never call `fetch` on the API URL directly from a component.
- **Numbers stay numbers until render.** The API returns prices as plain numbers. Convert only
  at render time with `src/lib/bn.ts` (`formatPrice`, `formatChange`, `perUnit`,
  `priceWithUnit`). Never sort the converted Bengali strings — challenge C1 must sort on the
  numeric `today` field.
- **`change.pct` can be negative.** For a falling price the API sends `dir: "down"` with a
  negative `pct`. Always decide the arrow/colour from `change.dir` and display
  `Math.abs(pct)` — `formatChange(dir, pct)` already does this.
- **`unit` is a Latin code** (`kg`, `litre`, `dozen`, `piece`). Never show it raw — use
  `perUnit(unit)` → "প্রতি কেজি" or `unitLabel(unit)` → "কেজি".
- **Tailwind is v4, not v3.** There is no `tailwind.config.js` and no `content` array.
  Everything is configured inside `src/app/globals.css` with `@import 'tailwindcss'`,
  `@plugin 'daisyui'`, `@theme` and `@utility`.
- **Colours come from the Figma and live in one place** — `src/app/globals.css`. The custom
  daisyUI theme `bazardor` holds the Figma's tokens, so use daisyUI classes
  (`btn-primary`, `bg-base-200`, `text-base-content`, `badge-success`) for most things.
  Change badges use the extra tokens `text-up` / `bg-up-soft`, `text-down` / `bg-down-soft`,
  `text-flat` / `bg-flat-soft`. Never hardcode a hex value in a component.
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

API base: `https://api.api-store.workers.dev/api/bazardor`
(fallback `https://api.abcz.workers.dev/api/bazardor` — `api.ts` tries both automatically).

| Endpoint | Returns |
| --- | --- |
| `/products` | array of 33 products |
| `/products?category=chal` | products in one category |
| `/products/1` | one product by numeric **id** (our routes use slug, so use `getProductBySlug`) |
| `/categories` | array of 8 categories |
| `/categories/chal` | one category |

Product fields: `id, slug, nameBn, category` (slug)`, categoryNameBn, categoryIcon, unit,
image` (emoji)`, today, yesterday, lastWeek, lastMonth, change { dir, pct }, markets[]`.
Each market: `market, division, min, max` — 12 markets per product.

Category fields: `id, slug, nameBn, icon`. Slugs: `chal, dal, tel, sobji, mach, mangsho,
dim-dui, mosla`.

`src/lib/api.ts` exposes `getAllProducts`, `getProductsByCategory`, `getProductBySlug`,
`getCategories`, `getCategoryBySlug`, `getTopRisers`, `getTopFallers`, and `marketStats`
(min / max / average across all markets, for the detail page).

Images: the hero illustration is `public/hero-basket.png`; a small cart icon is
`public/logo-cart.png`. The design (Figma) is not in the repo — ask Kawsar for a screenshot
of the page you are working on before building it.

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
