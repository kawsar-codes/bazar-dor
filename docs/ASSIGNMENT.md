# Assignment-7 — বাজার দর (BazarDor)

**Deadlines:** 60 marks — 10 October, 11:59 PM · 50 marks — 11 October, 11:59 PM ·
30 marks — any time after 11 October.

**Basic requirements:** responsive on all screen sizes · at least 8 meaningful git commits ·
no errors after deployment · README with name, description, technologies and at least 5
features.

## API
- Base URL 1: `https://api.api-store.workers.dev/api/bazardor`
- Base URL 2 (alternative): `https://api.abcz.workers.dev/api/bazardor`
- Endpoints: `/products`, `/products?category=chal`, `/products/1`, `/categories`, `/categories/chal`

## 1. Navbar
- Match the Figma.
- Left: logo 🛒 **বাজার দর** with the Bangla date underneath.
- Middle / second row: category navigation links. The active category link is highlighted.
- Right: **সাইন ইন** + **সাইন আপ**. When logged in, show profile / sign out instead.
- **Price ticker (marquee)** below the navbar: an infinite scrolling strip of
  emoji + name + দাম টাকা/একক + ▲/▼ %.

## 2. Hero / banner
- Eyebrow text, main heading, subtitle.
- A primary CTA that scrolls to the `#সব-পণ্য` section on the same page (anchor, not a route change).
- A hero image on the right.

## 3. Product sections (home page)
- **Section A — “আজ দাম বেড়েছে ▲”**: top 6 risers.
- **Section B — “আজ দাম কমেছে ▼”**: top 6 fallers.
- **Section C — “সব পণ্য”** with a subtitle: every product as cards in a responsive grid
  (3–4 columns on large screens, collapsing on mobile).

Each card shows: emoji · product name · unit line (প্রতি কেজি / লিটার / ডজন / পিস) ·
price row (আজকের দাম + value in Bengali digits) · change badge ▲ ২.১% / ▼ ২.৯% / — ০.০%
(green up, red down, grey flat). Clicking a card goes to that product's detail page.

## 4. Product detail page — `/product/[slug]`
**Protected route — requires login.**
- Top: emoji + title, market summary line, category tags, unit.
- Price summary: minimum, maximum and average price.
- **বাজারভিত্তিক আজকের দাম** — the per-bazar price list.

## 5. Category page — `/category/[slug]`
- Title + icon.
- Sort control: **সাজান:** ডিফল্ট | দাম: কম থেকে বেশি | দাম: বেশি থেকে কম.
- Loading state: skeleton while data is being fetched.
- Product cards, same design as home.
- Empty state for an unknown slug: 404-style message + **হোম পেজে ফিরে যান** linking to `/`.

## 6. Authentication — `/signin`, `/signup`
Use **BetterAuth** (email/password + Google + GitHub).

**Sign in:** title, form with email + password + login button. On success go to home; on
failure show a toast / inline error. Link to the register page. Social login button that
authenticates and goes to home.

**Sign up:** title, form with name + email + password + register button. On success go to
the sign-in page; on failure show a toast / inline error. Link to the sign-in page. Social
login button that authenticates and goes to home.

Toast on login / signup / logout / validation error.

**Do NOT implement email verification or forgot-password** — the assignment says not to.

## 7. Footer
- Match the Figma.
- Left: **বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।**
- Right: **সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।**

## 8. Responsive design
Must work on mobile, tablet and desktop — grid collapses, navbar + ticker stay usable,
hero stacks, `btn-sm sm:btn-md`, `max-w-6xl` container.

## Other requirements
- A **404 page** for any unknown route (`/category/invalid`, `/product/unknown`) with a
  friendly message + **হোম পেজে ফিরে যান**.
- **Loading skeletons** while product data is being fetched on home and category pages.
- Toasts for auth and protected-route redirects (react-hot-toast).
- **Reloading any page after deployment must not error** — dynamic `[slug]` routes must work
  on Vercel, no hard 404 on refresh.

## Challenge requirements — 10 marks
- **C1 — Sort dropdown:** “সাজান” with ডিফল্ট, দাম: কম থেকে বেশি, দাম: বেশি থেকে কম
  (default ডিফল্ট, chevron icon). Must sort by **numeric value**, not by string — Bengali
  numerals must be handled correctly.
- **C2 — GitHub README:** project name (বাজার দর / BazarDor), short description,
  technologies used, 5 key features.
- **C3 — Update information:** in the My Profile route add an update button that goes to
  another route with a form (Name field + an Update Information button).
  Docs: https://better-auth.com/docs/concepts/users-accounts#update-user

## Technologies
Next.js (App Router) · Tailwind CSS + a component library (daisyUI / Hero UI) ·
TypeScript / JavaScript · BetterAuth

## Deployment
Vercel (or Netlify / Cloudflare Pages).

## Submission
- Live link
- GitHub repository link
