# Build steps — prompts and commits

Give ONE prompt at a time to Claude in VS Code. After each step: check the site in the
browser, then run that step's commit commands, then move on.

Order matters: the 50-mark core (steps 1–7) comes before the challenge parts (8–9).
If time runs short, a finished core beats a half-finished everything.

---

## Step 0 — Install and environment (do this yourself first)

```bash
cd ~/projects/bazar-dor
npm install
cp .env.example .env.local
```

Then fill `.env.local`:

1. **MongoDB Atlas** — create a free cluster, add a database user, allow access from
   anywhere (0.0.0.0/0), copy the connection string into `MONGODB_URI`.
2. **BETTER_AUTH_SECRET** — run `openssl rand -base64 32` and paste the output.
3. **Google OAuth** — Google Cloud Console → Credentials → OAuth client ID → Web
   application. Redirect URI: `http://localhost:3000/api/auth/callback/google`.
4. **GitHub OAuth** — GitHub → Settings → Developer settings → OAuth Apps.
   Callback URL: `http://localhost:3000/api/auth/callback/github`.

```bash
npm run dev
```

---

## Step 1 — Navbar, price ticker and footer

**Prompt**

> Read CLAUDE.md and docs/ASSIGNMENT.md. Build the Navbar, the price ticker and the Footer,
> and wire them into src/app/layout.tsx so every page gets them.
> Navbar: sticky, logo 🛒 বাজার দর on the left with today's Bangla date underneath (use
> banglaDate from src/lib/bn.ts inside useEffect in a client component to avoid a hydration
> mismatch), category links from getCategories() in src/lib/api.ts in the middle with the active one
> highlighted, and সাইন ইন / সাইন আপ buttons on the right. On mobile collapse the links into
> a hamburger menu.
> Ticker: an infinite marquee strip under the navbar showing every product as
> image (emoji) + nameBn + priceWithUnit(today, unit) + formatChange(change.dir, change.pct), using the `ticker-track` utility already in
> globals.css — render the strip twice inside the track so the loop has no gap.
> Footer: বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে। on the left and
> সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়। on the right.
> Explain your plan in Bangla before writing the code.

**Commit**

```bash
git add -A && git commit -m "feat: add navbar with bangla date, price ticker and footer" && git push
```

---

## Step 2 — Product card and the three home sections

**Prompt**

> Now build the home page. First a reusable ProductCard component showing the emoji (image), nameBn, the unit line
> via perUnit(unit), আজকের দাম with formatPrice(today) টাকা, and the change badge
> (▲ green, ▼ red, — grey) via formatChange(change.dir, change.pct) — use the up/down/flat
> colour tokens from globals.css, never hardcoded hex. The whole card links to /product/[slug].
> Then three sections on the home page: আজ দাম বেড়েছে ▲ (getTopRisers), আজ দাম কমেছে ▼
> (getTopFallers), and সব পণ্য with id="সব-পণ্য" (getAllProducts) in a responsive grid —
> 1 column on mobile, 2 on tablet, 3–4 on desktop, inside a max-w-6xl container.

**Commit**

```bash
git add -A && git commit -m "feat: add product card and the three home page sections" && git push
```

---

## Step 3 — Hero section

**Prompt**

> Now add the Hero section at the top of the home page, above the three product sections.
> It needs an eyebrow line, a main heading, a subtitle, a primary CTA button that is an
> anchor link to #সব-পণ্য on the same page (not a route change), and the illustration
> public/hero-basket.png on the right. Stack it into one column on mobile. Keep all copy in Bangla and relevant to a
> market-price site.

**Commit**

```bash
git add -A && git commit -m "feat: add hero section with anchor CTA" && git push
```

---

## Step 4 — BetterAuth setup

**Prompt**

> Now set up BetterAuth with the MongoDB adapter, reading the env vars from .env.example.
> Create the auth instance, the /api/auth/[...all] route handler, and a client helper.
> Enable email/password plus Google and GitHub social providers. Do NOT enable email
> verification or password reset — the assignment forbids them. Explain in Bangla what each
> file does and how a session is read on the server.

**Commit**

```bash
git add -A && git commit -m "feat: set up BetterAuth with mongodb adapter and social providers" && git push
```

---

## Step 5 — Sign in and sign up pages

**Prompt**

> Now build /signin and /signup following docs/ASSIGNMENT.md section 6.
> Sign in: title, email + password form, login button, link to /signup, Google and GitHub
> buttons. On success go to /, on failure show a react-hot-toast error.
> Sign up: title, name + email + password form, register button, link to /signin, social
> buttons. On success go to /signin, on failure show a toast.
> Show a toast on logout too, and swap the navbar buttons for a profile link + sign out when
> a session exists.

**Commit**

```bash
git add -A && git commit -m "feat: add sign in and sign up pages with social login and toasts" && git push
```

---

## Step 6 — Protected product detail page

**Prompt**

> Now build /product/[slug] as a protected route — if there is no session, redirect to
> /signin and show a toast explaining why. Follow docs/ASSIGNMENT.md section 4: emoji +
> title, the summary line, category tags, unit, a price summary with সর্বনিম্ন / সর্বোচ্চ /
> গড় দাম from marketStats(product), and a বাজারভিত্তিক আজকের দাম section listing all 12
> markets with their division and min–max price range.
> An unknown slug must render the not-found page, never throw.

**Commit**

```bash
git add -A && git commit -m "feat: add protected product detail page with per-bazar prices" && git push
```

---

## Step 7 — Category page, 404 and loading skeletons

**Prompt**

> Now build /category/[slug]: title with the category icon, the product cards for that
> category, and loading.tsx files giving skeleton cards on the home and category pages while
> the data loads. Add a global not-found page with a friendly Bangla message and a
> হোম পেজে ফিরে যান button linking to /. An unknown category slug shows that same empty /
> 404 state.

**Commit**

```bash
git add -A && git commit -m "feat: add category page, 404 page and loading skeletons" && git push
```

---

## Step 8 — C1: sort dropdown

**Prompt**

> Now add the sort control to the category page: a dropdown labelled সাজান with a chevron
> icon and the options ডিফল্ট, দাম: কম থেকে বেশি, দাম: বেশি থেকে কম, defaulting to ডিফল্ট.
> It is a client component. Sort on the numeric `today` field, never on the displayed
> Bengali-digit string.

**Commit**

```bash
git add -A && git commit -m "feat: add sort dropdown to the category page" && git push
```

---

## Step 9 — C3: profile and update information

**Prompt**

> Now add /profile showing the signed-in user's name and email with an update button that
> goes to /profile/update. That page has a form with a Name field and an
> Update Information button, calling BetterAuth's updateUser
> (https://better-auth.com/docs/concepts/users-accounts#update-user), with a toast on
> success and on error. Both routes are protected.

**Commit**

```bash
git add -A && git commit -m "feat: add profile page and update information form" && git push
```

---

## Step 10 — Responsive polish

**Prompt**

> Check the whole site at 375px, 768px and 1440px and fix any responsive problems — grids
> that do not collapse, the ticker or navbar overflowing, the hero not stacking, text that is
> too large on mobile. Also make sure no English placeholder text is left anywhere.

**Commit**

```bash
git add -A && git commit -m "style: polish responsive layout across mobile, tablet and desktop" && git push
```

---

## Step 11 — C2: README (write this yourself)

The README needs: project name (বাজার দর / BazarDor), a short description, the technologies
used, and **5 key features**. Write the features in your own words — you built them.

```bash
git add -A && git commit -m "docs: add project README" && git push
```

---

## Step 12 — Deploy to Vercel

1. vercel.com → Add New → Project → import `bazar-dor`.
2. Add every variable from `.env.local` under **Environment Variables**, but set
   `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the Vercel URL, not localhost.
3. Deploy.
4. Add the Vercel callback URLs to the Google and GitHub OAuth apps:
   `https://<your-app>.vercel.app/api/auth/callback/google` and `.../github`.
5. **Test a refresh** on `/product/<slug>` and `/category/<slug>` on the live site.

```bash
git add -A && git commit -m "docs: add live site link to README" && git push
```

---

## Submission

- Live link: (add after deploying)
- GitHub repository: (add after creating the repo)
