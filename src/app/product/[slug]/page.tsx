import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import ChangeBadge from '@/components/ChangeBadge'
import { getProductBySlug, marketStats, type Product } from '@/lib/api'
import { formatPrice, perUnit, toBengaliDigits, unitLabel } from '@/lib/bn'
import { getSession } from '@/lib/session'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'পণ্য পাওয়া যায়নি — বাজার দর' }
  return {
    title: `${product.nameBn} — আজকের দাম | বাজার দর`,
    description: `${product.nameBn}-এর আজকের বাজারদর ${formatPrice(product.today)} টাকা ${perUnit(product.unit)}।`,
  }
}

/** A one-line market summary built from the price history the API gives us. */
function summaryLine(product: Product): string {
  const unit = unitLabel(product.unit)
  const direction =
    product.change.dir === 'up'
      ? 'বেড়েছে'
      : product.change.dir === 'down'
        ? 'কমেছে'
        : 'অপরিবর্তিত আছে'

  const pct = toBengaliDigits(Math.abs(product.change.pct).toFixed(1))
  const movement =
    product.change.dir === 'flat'
      ? `গতকালের তুলনায় দাম ${direction}`
      : `গতকালের তুলনায় দাম ${pct}% ${direction}`

  return `আজ ${product.nameBn}-এর গড় বাজারদর ${formatPrice(product.today)} টাকা ${perUnit(product.unit).replace('প্রতি ', 'প্রতি ')}। ${movement} — গতকাল ছিল ${formatPrice(product.yesterday)} টাকা, গত সপ্তাহে ${formatPrice(product.lastWeek)} টাকা এবং গত মাসে ${formatPrice(product.lastMonth)} টাকা প্রতি ${unit}।`
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-4">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="mt-1 text-2xl font-bold text-base-content">
        {formatPrice(value)} <span className="text-base font-medium">টাকা</span>
      </p>
      <p className="text-xs text-base-content/50">প্রতি {unit}</p>
    </div>
  )
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  // Protected route: send anonymous visitors to sign in, remembering where they
  // were headed so they land back here afterwards.
  const session = await getSession()
  if (!session) {
    redirect(`/signin?reason=protected&next=${encodeURIComponent(`/product/${slug}`)}`)
  }

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const stats = marketStats(product)
  const unit = unitLabel(product.unit)

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <span className="text-6xl leading-none" aria-hidden="true">
          {product.image}
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-base-content">{product.nameBn}</h1>
            <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
          </div>

          <p className="mt-3 text-base-content/70">{summaryLine(product)}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge badge-outline">
              <span aria-hidden="true">{product.categoryIcon}</span> {product.categoryNameBn}
            </span>
            <span className="badge badge-outline">{perUnit(product.unit)}</span>
          </div>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-base-content">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="সর্বনিম্ন দাম" value={stats.min} unit={unit} />
          <StatCard label="সর্বোচ্চ দাম" value={stats.max} unit={unit} />
          <StatCard label="গড় দাম" value={stats.avg} unit={unit} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-1 text-xl font-bold text-base-content">বাজারভিত্তিক আজকের দাম</h2>
        <p className="mb-4 text-sm text-base-content/60">
          দেশের {toBengaliDigits(product.markets.length)}টি বাজারে {product.nameBn}-এর আজকের দামের
          পরিসর।
        </p>

        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>বাজার</th>
                <th>বিভাগ</th>
                <th className="text-right">সর্বনিম্ন</th>
                <th className="text-right">সর্বোচ্চ</th>
              </tr>
            </thead>
            <tbody>
              {product.markets.map((market) => (
                <tr key={`${market.division}-${market.market}`}>
                  <td className="font-medium">{market.market}</td>
                  <td className="text-base-content/70">{market.division}</td>
                  <td className="text-right whitespace-nowrap">{formatPrice(market.min)} টাকা</td>
                  <td className="text-right whitespace-nowrap">{formatPrice(market.max)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  )
}
