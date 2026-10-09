import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <span className="text-6xl" aria-hidden="true">
        🧺
      </span>
      <h1 className="text-3xl font-bold text-base-content">পাতাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="text-base-content/70">
        আপনি যে পণ্য বা ক্যাটাগরিটি খুঁজছেন সেটি আমাদের তালিকায় নেই। ঠিকানাটি আবার মিলিয়ে দেখুন,
        অথবা হোম পেজ থেকে ঘুরে আসুন।
      </p>
      <Link href="/" className="btn btn-primary btn-sm sm:btn-md">
        হোম পেজে ফিরে যান
      </Link>
    </section>
  )
}
