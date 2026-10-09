export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <div className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-base-content">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-base-content/60">{subtitle}</p>
        {children}
      </div>
    </section>
  )
}
