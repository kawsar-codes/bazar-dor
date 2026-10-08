import type { Metadata } from 'next'
import { Hind_Siliguri } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import PriceTicker from '@/components/PriceTicker'
import { getCategories } from '@/lib/api'
import './globals.css'

const bangla = Hind_Siliguri({
  variable: '--font-bangla',
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে',
  description:
    'চাল, সবজি, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক জায়গায়। বাজারভিত্তিক দাম, দাম বাড়া-কমার হিসাব ও ক্যাটাগরি অনুযায়ী তালিকা।',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const categories = await getCategories()

  return (
    <html lang="bn" className={`${bangla.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar categories={categories} />
        <PriceTicker />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
