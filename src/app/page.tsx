import Hero from '@/components/Hero'
import ProductSection from '@/components/ProductSection'
import { getAllProducts, getTopFallers, getTopRisers, safeList } from '@/lib/api'

/** Shown only when the price API is unreachable, so the page still renders
 *  something honest instead of returning a 500. */
function ApiUnavailable() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden="true">
        🧺
      </p>
      <h2 className="mt-4 text-2xl font-bold text-base-content">দাম এখন আনা যাচ্ছে না</h2>
      <p className="mt-2 text-base-content/70">
        বাজারদরের সার্ভারে সাময়িক সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।
      </p>
    </section>
  )
}

export default async function Home() {
  const [risers, fallers, allProducts] = await Promise.all([
    safeList(getTopRisers),
    safeList(getTopFallers),
    safeList(getAllProducts),
  ])

  return (
    <>
      <Hero />
      {allProducts.length === 0 ? (
        <ApiUnavailable />
      ) : (
        <>
          <ProductSection title="আজ দাম বেড়েছে ▲" products={risers} />
          <ProductSection title="আজ দাম কমেছে ▼" products={fallers} />
          <ProductSection
            id="সব-পণ্য"
            title="সব পণ্য"
            subtitle="বাজারের সকল পণ্যের আজকের দাম এক নজরে"
            products={allProducts}
          />
        </>
      )}
    </>
  )
}
