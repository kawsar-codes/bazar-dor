'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'

const PROVIDERS = [
  { id: 'google', label: 'Google দিয়ে চালিয়ে যান' },
  { id: 'github', label: 'GitHub দিয়ে চালিয়ে যান' },
] as const

export default function SocialButtons() {
  const [pending, setPending] = useState<string | null>(null)

  async function handleSocial(provider: (typeof PROVIDERS)[number]['id']) {
    setPending(provider)
    const { error } = await authClient.signIn.social({ provider, callbackURL: '/' })
    if (error) {
      toast.error(error.message ?? 'সোশ্যাল লগইন করা গেল না।')
      setPending(null)
    }
    // On success the browser is redirected to the provider, so there is nothing
    // left to do here.
  }

  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="btn btn-outline btn-sm sm:btn-md"
          disabled={pending !== null}
          onClick={() => handleSocial(provider.id)}
        >
          {pending === provider.id ? 'অপেক্ষা করুন…' : provider.label}
        </button>
      ))}
    </div>
  )
}
