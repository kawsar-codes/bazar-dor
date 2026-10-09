import { ProductGridSkeleton } from '@/components/Skeletons'

export default function CategoryLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10" aria-busy="true" aria-live="polite">
      <div className="skeleton mb-2 h-8 w-48" />
      <div className="skeleton mb-6 h-4 w-64" />
      <div className="skeleton mb-6 h-10 w-56" />
      <ProductGridSkeleton count={8} />
    </section>
  )
}
