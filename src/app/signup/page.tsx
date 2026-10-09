import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthCard from '@/components/AuthCard'
import SignUpForm from '@/components/SignUpForm'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'সাইন আপ — বাজার দর' }

export default async function SignUpPage() {
  const session = await getSession()
  if (session) redirect('/')

  return (
    <AuthCard title="সাইন আপ" subtitle="নতুন অ্যাকাউন্ট খুলে বাজার দরের সব সুবিধা ব্যবহার করুন।">
      <SignUpForm />
    </AuthCard>
  )
}
