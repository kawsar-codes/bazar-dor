'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SocialButtons from '@/components/SocialButtons'
import { authClient } from '@/lib/auth-client'

export default function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')

  // A protected page sends the visitor here with ?reason=protected.
  const reason = searchParams.get('reason')
  useEffect(() => {
    if (reason === 'protected') {
      toast('এই পাতাটি দেখতে আগে সাইন ইন করুন।', { icon: '🔒' })
    }
  }, [reason])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!email || !password) {
      const message = 'ইমেইল ও পাসওয়ার্ড দুটোই দিন।'
      setFormError(message)
      toast.error(message)
      return
    }

    setPending(true)
    const { error } = await authClient.signIn.email({ email, password })
    setPending(false)

    if (error) {
      const message = error.message ?? 'ইমেইল বা পাসওয়ার্ড ঠিক নয়।'
      setFormError(message)
      toast.error(message)
      return
    }

    toast.success('সাইন ইন সফল হয়েছে।')
    const next = searchParams.get('next')
    router.push(next && next.startsWith('/') ? next : '/')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
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
            autoComplete="current-password"
            placeholder="••••••••"
            className="input input-bordered w-full"
          />
        </label>

        {formError && (
          <p role="alert" className="text-sm text-error">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-sm sm:btn-md" disabled={pending}>
          {pending ? 'সাইন ইন হচ্ছে…' : 'লগইন'}
        </button>
      </form>

      <div className="divider my-0 text-xs text-base-content/50">অথবা</div>

      <SocialButtons />

      <p className="text-center text-sm text-base-content/70">
        অ্যাকাউন্ট নেই?{' '}
        <Link href="/signup" className="font-medium text-primary hover:text-hover-link">
          রেজিস্টার করুন
        </Link>
      </p>
    </div>
  )
}
