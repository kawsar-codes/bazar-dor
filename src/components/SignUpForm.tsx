'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SocialButtons from '@/components/SocialButtons'
import { authClient } from '@/lib/auth-client'

const MIN_PASSWORD_LENGTH = 8

export default function SignUpForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!name || !email || !password) {
      const message = 'নাম, ইমেইল ও পাসওয়ার্ড সবগুলোই দিন।'
      setFormError(message)
      toast.error(message)
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      const message = `পাসওয়ার্ড অন্তত ${MIN_PASSWORD_LENGTH} অক্ষরের হতে হবে।`
      setFormError(message)
      toast.error(message)
      return
    }

    setPending(true)
    const { error } = await authClient.signUp.email({ name, email, password })
    setPending(false)

    if (error) {
      const message = error.message ?? 'রেজিস্ট্রেশন করা গেল না।'
      setFormError(message)
      toast.error(message)
      return
    }

    toast.success('রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন।')
    router.push('/signin')
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className="form-control">
          <span className="mb-1 block text-sm font-medium">নাম</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="আপনার নাম"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control">
          <span className="mb-1 block text-sm font-medium">ইমেইল</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control">
          <span className="mb-1 block text-sm font-medium">পাসওয়ার্ড</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="অন্তত ৮ অক্ষর"
            className="input input-bordered w-full"
          />
        </label>

        {formError && (
          <p role="alert" className="text-sm text-error">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-sm sm:btn-md" disabled={pending}>
          {pending ? 'রেজিস্টার হচ্ছে…' : 'রেজিস্টার'}
        </button>
      </form>

      <div className="divider my-0 text-xs text-base-content/50">অথবা</div>

      <SocialButtons />

      <p className="text-center text-sm text-base-content/70">
        আগে থেকেই অ্যাকাউন্ট আছে?{' '}
        <Link href="/signin" className="font-medium text-primary hover:text-hover-link">
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  )
}
