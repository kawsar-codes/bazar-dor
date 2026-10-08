import Hero from '@/components/Hero'
import ProductSection from '@/components/ProductSection'
import { getAllProducts, getTopFallers, getTopRisers } from '@/lib/api'

export default async function Home() {
  const [risers, fallers, allProducts] = await Promise.all([
    getTopRisers(),
    getTopFallers(),
    getAllProducts(),
  ])

  return (
    <>
      <Hero />
      <ProductSection title="আজ দাম বেড়েছে ▲" products={risers} />
      <ProductSection title="আজ দাম কমেছে ▼" products={fallers} />
      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="বাজারের সকল পণ্যের আজকের দাম এক নজরে"
        products={allProducts}
      />
    </>
  )
}
