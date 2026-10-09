'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'

export type SessionUser = {
  name?: string | null
  email?: string | null
}

export default function UserMenu({
  user,
  stacked = false,
}: {
  user: SessionUser
  stacked?: boolean
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    const { error } = await authClient.signOut()
    setPending(false)

    if (error) {
      toast.error(error.message ?? 'সাইন আউট করা গেল না।')
      return
    }

    toast.success('সাইন আউট হয়েছে।')
    router.push('/')
    router.refresh()
  }

  const label = user.name?.trim() || user.email || 'প্রোফাইল'

  return (
    <div className={stacked ? 'flex gap-2' : 'flex items-center gap-2'}>
      <Link
        href="/profile"
        className={`btn btn-sm btn-ghost max-w-[10rem] truncate ${stacked ? 'flex-1' : ''}`}
        title={label}
      >
        <span aria-hidden="true">👤</span> {label}
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className={`btn btn-sm btn-outline ${stacked ? 'flex-1' : ''}`}
      >
        {pending ? 'অপেক্ষা…' : 'সাইন আউট'}
      </button>
    </div>
  )
}
