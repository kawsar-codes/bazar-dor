export default function ProductLoading() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10" aria-busy="true" aria-live="polite">
      <div className="skeleton h-16 w-16 rounded-box" />
      <div className="skeleton mt-4 h-8 w-64" />
      <div className="skeleton mt-3 h-4 w-full max-w-lg" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
      <div className="skeleton mt-8 h-64 w-full" />
    </section>
  )
}
