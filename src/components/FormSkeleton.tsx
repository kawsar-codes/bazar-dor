export default function FormSkeleton() {
  return (
    <section
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
        <div className="skeleton h-7 w-32" />
        <div className="skeleton mt-3 h-4 w-full" />
        <div className="skeleton mt-8 h-12 w-full" />
        <div className="skeleton mt-4 h-12 w-full" />
        <div className="skeleton mt-6 h-10 w-full" />
      </div>
    </section>
  )
}
