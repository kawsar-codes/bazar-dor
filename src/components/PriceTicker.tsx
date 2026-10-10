import { getAllProducts, safeList, type Product } from '@/lib/api'
import { formatChange, priceWithUnit } from '@/lib/bn'

const CHANGE_COLOR: Record<Product['change']['dir'], string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-flat',
}

function TickerItems({ products, copy }: { products: Product[]; copy: string }) {
  return (
    <>
      {products.map((p) => (
        <div
          key={`${copy}-${p.id}`}
          className="flex items-center gap-2 px-6 py-2 text-sm whitespace-nowrap"
        >
          <span aria-hidden="true">{p.image}</span>
          <span className="font-medium">{p.nameBn}</span>
          <span className="text-base-content/70">{priceWithUnit(p.today, p.unit)}</span>
          <span className={CHANGE_COLOR[p.change.dir]}>
            {formatChange(p.change.dir, p.change.pct)}
          </span>
        </div>
      ))}
    </>
  )
}

export default async function PriceTicker() {
  const products = await safeList(getAllProducts)
  if (products.length === 0) return null

  return (
    <div className="overflow-hidden border-b border-base-300 bg-base-200">
      <div className="ticker-track">
        <TickerItems products={products} copy="a" />
        <TickerItems products={products} copy="b" />
      </div>
    </div>
  )
}
