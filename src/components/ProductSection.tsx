import type { Product } from '@/lib/api'
import ProductCard from './ProductCard'

type ProductSectionProps = {
  id?: string
  title: string
  subtitle?: string
  products: Product[]
}

export default function ProductSection({ id, title, subtitle, products }: ProductSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-base-content sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
