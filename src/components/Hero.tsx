import Image from 'next/image'

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-12">
        <div className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
          <span className="badge badge-soft badge-primary mb-4">প্রতিদিনের বাজার দর</span>

          <h1 className="text-3xl font-bold leading-tight text-base-content sm:text-4xl lg:text-5xl">
            বাজারে যাওয়ার আগে, দাম জেনে নিন
          </h1>

          <p className="mt-4 text-base text-base-content/70 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের বাজার দর — দেশের বিভিন্ন বাজার থেকে সংগ্রহ করা
            তথ্য, প্রতিদিন আপডেট হয়। কোন পণ্যের দাম বাড়ল, কোনটা কমল — সব এক জায়গায়।
          </p>

          <a href="#সব-পণ্য" className="btn btn-primary btn-sm mt-6 sm:btn-md">
            সব পণ্যের দাম দেখুন
          </a>
        </div>

        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Image
            src="/hero-basket.png"
            alt="পণ্যভর্তি বাজারের ঝুড়ি"
            width={630}
            height={526}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}
