import Link from 'next/link'
import ChangeBadge from '@/components/ChangeBadge'
import type { Product } from '@/lib/api'
import { formatPrice, perUnit } from '@/lib/bn'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
    >
      <div className="card-body gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-3xl" aria-hidden="true">
            {product.image}
          </span>
          <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
        </div>

        <h3 className="font-semibold text-base-content">{product.nameBn}</h3>
        <p className="text-xs text-base-content/60">{perUnit(product.unit)}</p>

        <p className="mt-1 text-sm text-base-content/70">
          আজকের দাম{' '}
          <span className="text-lg font-bold text-base-content">{formatPrice(product.today)}</span>{' '}
          টাকা
        </p>
      </div>
    </Link>
  )
}
