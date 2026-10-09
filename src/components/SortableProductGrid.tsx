'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/api'

const SORT_OPTIONS = [
  { value: 'default', label: 'ডিফল্ট' },
  { value: 'price-asc', label: 'দাম: কম থেকে বেশি' },
  { value: 'price-desc', label: 'দাম: বেশি থেকে কম' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

export default function SortableProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortValue>('default')

  const sorted = useMemo(() => {
    // Sorting always runs on the numeric `today` field. The Bengali digits the
    // cards display are produced at render time, so they never take part in the
    // comparison — "১০" would otherwise sort before "৯".
    if (sort === 'price-asc') return [...products].sort((a, b) => a.today - b.today)
    if (sort === 'price-desc') return [...products].sort((a, b) => b.today - a.today)
    return products
  }, [products, sort])

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-base-content/70">
          সাজান:
        </label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="select select-bordered select-sm appearance-none pr-9"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-base-content/60"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
