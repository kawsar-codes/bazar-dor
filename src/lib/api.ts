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

async function apiGet<T>(path: string): Promise<T> {
  let lastError: unknown
  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate: REVALIDATE_SECONDS } })
      if (res.ok) return (await res.json()) as T
      lastError = new Error(`${res.status} ${res.statusText} for ${base}${path}`)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

export function getAllProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products')
}

export function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return apiGet<Product[]>(`/products?category=${encodeURIComponent(categorySlug)}`)
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
