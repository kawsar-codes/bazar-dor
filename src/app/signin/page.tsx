import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import AuthCard from '@/components/AuthCard'
import SignInForm from '@/components/SignInForm'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'সাইন ইন — বাজার দর' }

export default async function SignInPage() {
  const session = await getSession()
  if (session) redirect('/')

  return (
    <AuthCard title="সাইন ইন" subtitle="আপনার অ্যাকাউন্টে প্রবেশ করে পণ্যের বিস্তারিত দাম দেখুন।">
      <Suspense fallback={<div className="skeleton h-72 w-full" />}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  )
}
