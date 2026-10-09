import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'আমার প্রোফাইল — বাজার দর' }

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/signin?reason=protected&next=%2Fprofile')

  const { user } = session

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-base-content">আমার প্রোফাইল</h1>
      <p className="mt-1 mb-6 text-sm text-base-content/60">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখা ও পরিবর্তন করা যাবে।
      </p>

      <dl className="divide-y divide-base-300 rounded-box border border-base-300 bg-base-100">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-base-content/60">নাম</dt>
          <dd className="font-medium text-base-content">{user.name || '—'}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-base-content/60">ইমেইল</dt>
          <dd className="font-medium break-all text-base-content">{user.email}</dd>
        </div>
      </dl>

      <Link href="/profile/update" className="btn btn-primary btn-sm sm:btn-md mt-6">
        তথ্য হালনাগাদ করুন
      </Link>
    </section>
  )
}
