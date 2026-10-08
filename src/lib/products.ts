import categoriesData from '@/data/categories.json'
import productsData from '@/data/products.json'

export type BazarPrice = {
  bazar: string
  price: number
}

export type Product = {
  slug: string
  emoji: string
  name: string
  category: string
  categorySlug: string
  unit: string
  /** today's price in taka, as a plain number */
  price: number
  /** percent change since yesterday: positive up, negative down, 0 flat */
  change: number
  summary: string
  tags: string[]
  min: number
  max: number
  avg: number
  bazars: BazarPrice[]
}

export type Category = {
  slug: string
  name: string
  emoji: string
}

const products = productsData as Product[]
const categories = categoriesData as Category[]

/** Stands in for a network round trip so the loading skeletons are actually
 *  visible. Remove it if the data ever moves to a real API. */
const FETCH_DELAY_MS = 400

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY_MS))
}

export async function getAllProducts(): Promise<Product[]> {
  await delay()
  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay()
  return products.find((p) => p.slug === slug) ?? null
}

/** Top N products whose price rose the most today. */
export async function getTopRisers(count = 6): Promise<Product[]> {
  await delay()
  return [...products].filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, count)
}

/** Top N products whose price fell the most today. */
export async function getTopFallers(count = 6): Promise<Product[]> {
  await delay()
  return [...products].filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, count)
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  await delay()
  return products.filter((p) => p.categorySlug === categorySlug)
}

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null
}
