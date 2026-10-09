import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import UpdateProfileForm from '@/components/UpdateProfileForm'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'তথ্য হালনাগাদ — বাজার দর' }

export default async function UpdateProfilePage() {
  const session = await getSession()
  if (!session) redirect('/signin?reason=protected&next=%2Fprofile%2Fupdate')

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-base-content">তথ্য হালনাগাদ</h1>
      <p className="mt-1 mb-6 text-sm text-base-content/60">
        আপনার প্রদর্শিত নামটি এখানে পরিবর্তন করতে পারবেন।
      </p>

      <UpdateProfileForm initialName={session.user.name ?? ''} />
    </section>
  )
}
