import fallbackCategories from '@/data/fallback-categories.json'
import fallbackProducts from '@/data/fallback-products.json'

/** Data layer for the Bazardor API.
 *
 *  The assignment provides two base URLs. We try the first and fall back to the
 *  second if it fails, so a single outage does not take the site down. */

const BASE_URLS = [
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
]

/** Re-fetch at most every 5 minutes. Prices change daily, not by the second. */
const REVALIDATE_SECONDS = 300

export type ChangeDir = 'up' | 'down' | 'flat'

export type Market = {
  market: string
  division: string
  min: number
  max: number
}

export type Product = {
  id: number
  slug: string
  nameBn: string
  /** category slug, e.g. "chal" */
  category: string
  categoryNameBn: string
  categoryIcon: string
  /** "kg" | "litre" | "dozen" | "piece" — turn into Bangla with unitLabel() */
  unit: string
  /** an emoji */
  image: string
  today: number
  yesterday: number
  lastWeek: number
  lastMonth: number
  change: {
    dir: ChangeDir
    /** percent; may be negative when dir is "down" — always display Math.abs */
    pct: number
  }
  markets: Market[]
}

export type Category = {
  id: string
  slug: string
  nameBn: string
  icon: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** The last successful response for each path.
 *
 *  Serverless instances are short-lived, but within one instance this lets a
 *  brief API outage serve slightly stale prices instead of a 500 page. */
const lastGood = new Map<string, unknown>()

/** A snapshot of the API taken while it was healthy, committed to the repo.
 *
 *  The live API is the source of truth and is always tried first. This is the
 *  last resort: the free Cloudflare Worker behind it rate-limits, and a market
 *  price site that shows nothing at all is worse than one showing a snapshot. */
const FALLBACKS: Record<string, unknown> = {
  '/products': fallbackProducts,
  '/categories': fallbackCategories,
}

/** Tries each base URL, and retries a couple of times with a growing pause.
 *
 *  The API rate-limits (429) when a build asks for many pages at once, so a
 *  short back-off is the difference between a green deploy and a failed one.
 *  If everything fails we fall back to the last good response for this path. */
async function apiGet<T>(path: string): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt += 1) {
    for (const base of BASE_URLS) {
      try {
        const res = await fetch(`${base}${path}`, {
          next: { revalidate: REVALIDATE_SECONDS },
          // Bound each attempt so a hanging API cannot stall the whole page.
          signal: AbortSignal.timeout(6000),
        })
        if (res.ok) {
          const data = (await res.json()) as T
          lastGood.set(path, data)
          return data
        }
        lastError = new Error(`${res.status} ${res.statusText} for ${base}${path}`)
      } catch (error) {
        lastError = error
      }
    }
    if (attempt < 2) await sleep(1000 * (attempt + 1))
  }

  if (lastGood.has(path)) {
    console.warn(`[api] serving stale data for ${path}`, lastError)
    return lastGood.get(path) as T
  }

  if (path in FALLBACKS) {
    console.warn(`[api] API unavailable, serving the bundled snapshot for ${path}`, lastError)
    return FALLBACKS[path] as T
  }

  throw lastError
}

/** Never throws: returns an empty list when the API cannot be reached.
 *
 *  The navbar and the ticker sit in the root layout, so an unhandled error
 *  there would turn every single page into a 500. Degrading to an empty list
 *  keeps the site standing. */
export async function safeList<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load()
  } catch (error) {
    console.error('[api] request failed, rendering without data', error)
    return []
  }
}

export function getAllProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products')
}

/** Filters the full list rather than calling /products?category=…
 *
 *  Every category page would otherwise be its own URL, and pre-rendering all
 *  eight at build time tripped the API's rate limit. Reusing /products means
 *  Next's data cache serves them all from one response. */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts()
  return products.filter((p) => p.category === categorySlug)
}

/** The API's single-product endpoint takes a numeric id, but our routes use the
 *  slug, so we look the slug up in the full list. Returns null if not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>('/categories')
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

/** Signed change used for ranking: positive for up, negative for down. */
function signedChange(p: Product): number {
  const pct = Math.abs(p.change.pct)
  if (p.change.dir === 'up') return pct
  if (p.change.dir === 'down') return -pct
  return 0
}

/** The N products whose price rose the most today. */
export async function getTopRisers(count = 6): Promise<Product[]> {
  const products = await getAllProducts()
  return products
    .filter((p) => p.change.dir === 'up')
    .sort((a, b) => signedChange(b) - signedChange(a))
    .slice(0, count)
}

/** The N products whose price fell the most today. */
export async function getTopFallers(count = 6): Promise<Product[]> {
  const products = await getAllProducts()
  return products
    .filter((p) => p.change.dir === 'down')
    .sort((a, b) => signedChange(a) - signedChange(b))
    .slice(0, count)
}

/** Minimum, maximum and average across every market for one product. */
export function marketStats(product: Product): { min: number; max: number; avg: number } {
  const mins = product.markets.map((m) => m.min)
  const maxes = product.markets.map((m) => m.max)
  const mids = product.markets.map((m) => (m.min + m.max) / 2)
  return {
    min: Math.min(...mins),
    max: Math.max(...maxes),
    avg: Math.round(mids.reduce((sum, v) => sum + v, 0) / mids.length),
  }
}
