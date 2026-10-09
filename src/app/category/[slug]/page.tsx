import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SortableProductGrid from '@/components/SortableProductGrid'
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/api'
import { toBengaliDigits } from '@/lib/bn'

type Props = { params: Promise<{ slug: string }> }

/** Pre-render the eight known categories; anything else still works, it is just
 *  rendered on demand and falls through to notFound(). */
export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'ক্যাটাগরি পাওয়া যায়নি — বাজার দর' }
  return {
    title: `${category.nameBn} — আজকের দাম | বাজার দর`,
    description: `${category.nameBn} ক্যাটাগরির সব পণ্যের আজকের বাজারদর এক নজরে।`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const products = await getProductsByCategory(slug)
  if (products.length === 0) notFound()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-base-content sm:text-3xl">
        <span aria-hidden="true">{category.icon}</span> {category.nameBn}
      </h1>
      <p className="mt-1 mb-6 text-sm text-base-content/60">
        এই ক্যাটাগরিতে {toBengaliDigits(products.length)}টি পণ্যের আজকের দাম।
      </p>

      <SortableProductGrid products={products} />
    </section>
  )
}
