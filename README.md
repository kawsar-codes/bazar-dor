# 🛒 বাজার দর — BazarDor

**বাজার দর** (BazarDor) is a Bangla market-price website for everyday essentials. It shows
today's price of rice, vegetables, fish, meat, pulses, oil and spices across twelve markets in
Bangladesh, which items went up or down since yesterday, and how each item's price has moved
over the last week and month — all in Bengali, with prices written in Bengali numerals.

- **Live site:** _add after deploying_
- **Repository:** https://github.com/kawsar-codes/bazar-dor

## Technologies Used

| Technology | Purpose |
| --- | --- |
| **Next.js 16 (App Router)** | pages, routing, server rendering |
| **React 19** | UI components |
| **TypeScript** | type safety across the data layer and components |
| **Tailwind CSS v4** | styling and responsiveness |
| **daisyUI 5** | component styles, themed from the Figma design tokens |
| **BetterAuth** | email/password, Google and GitHub authentication |
| **MongoDB Atlas** | stores users and sessions |
| **react-hot-toast** | toast notifications |
| **Vercel** | hosting |

## Key Features

1. **Live market prices from an API, in Bengali numerals.** Every product is fetched from the
   Bazardor API and rendered with Bengali digits (`১,৮৫০ টাকা`), the correct Bangla unit
   (`প্রতি কেজি`, `প্রতি লিটার`, `প্রতি ডজন`, `প্রতি পিস`), and a green ▲ / red ▼ / grey —
   badge showing how much the price moved since yesterday.

2. **Risers and fallers at a glance.** The home page opens with the six items whose prices rose
   the most today and the six that fell the most, followed by the full product list — so you can
   see what got expensive before scrolling anywhere.

3. **An infinite price ticker.** A marquee strip under the navbar scrolls every product's name,
   price and change continuously, and pauses when you hover it so you can read a row.

4. **Per-market price breakdown behind a login.** Signing in unlocks each product's detail page:
   its lowest, highest and average price, plus a table of all twelve markets with their own
   price ranges. Visitors who are not signed in are sent to the sign-in page and brought back to
   the page they wanted once they log in.

5. **Category browsing with a correct numeric sort.** Each of the eight categories has its own
   page with a **সাজান** dropdown (ডিফল্ট / দাম: কম থেকে বেশি / দাম: বেশি থেকে কম). The sort runs
   on the underlying numbers, not on the Bengali text, so `৯` correctly comes before `১০`.

Also included: full authentication with Google and GitHub, a profile page with an update-name
form, loading skeletons on every data-driven page, toast notifications for every auth action,
a Bangla 404 page, and a layout that works from 375px phones up to desktop.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

### Environment variables

| Variable | Where it comes from |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, the deployed URL in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials → OAuth client ID |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub → Settings → Developer settings → OAuth Apps |

OAuth callback URLs are `/api/auth/callback/google` and `/api/auth/callback/github`.

Social login is optional in development: a provider is only registered when both of its
variables are set, so the site runs fine with email/password alone.

## Data Source

All product data comes from the assignment's API:
`https://api.api-store.workers.dev/api/bazardor` — 33 products across 8 categories, each with
twelve per-market price ranges. `src/lib/api.ts` falls back to the alternative base URL if the
first one fails.

## Project Structure

```
src/
  app/         routes — home, product/[slug], category/[slug], signin, signup, profile
  components/  navbar, ticker, hero, product cards, forms, skeletons
  lib/
    api.ts     typed fetchers for the Bazardor API
    bn.ts      Bengali digits, units, change badges, Bangla date
    auth.ts    BetterAuth server instance
```

---

Built by [Kawsar Akando](https://github.com/kawsar-codes)
