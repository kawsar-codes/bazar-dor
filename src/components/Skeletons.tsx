export function ProductCardSkeleton() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="skeleton h-9 w-9 rounded-field" />
        <div className="skeleton h-5 w-16 rounded-selector" />
      </div>
      <div className="skeleton mt-3 h-4 w-2/3" />
      <div className="skeleton mt-2 h-3 w-1/3" />
      <div className="skeleton mt-4 h-6 w-1/2" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function SectionSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="skeleton mb-6 h-7 w-56" />
      <ProductGridSkeleton count={count} />
    </section>
  )
}
