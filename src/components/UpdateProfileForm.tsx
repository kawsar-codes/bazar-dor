'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const trimmed = name.trim()
    if (!trimmed) {
      const message = 'নাম খালি রাখা যাবে না।'
      setFormError(message)
      toast.error(message)
      return
    }

    setPending(true)
    const { error } = await authClient.updateUser({ name: trimmed })
    setPending(false)

    if (error) {
      const message = error.message ?? 'তথ্য হালনাগাদ করা গেল না।'
      setFormError(message)
      toast.error(message)
      return
    }

    toast.success('তথ্য হালনাগাদ হয়েছে।')
    router.push('/profile')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-6"
      noValidate
    >
      <label className="form-control">
        <span className="mb-1 block text-sm font-medium">নাম</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="আপনার নাম"
          className="input input-bordered w-full"
        />
      </label>

      {formError && (
        <p role="alert" className="text-sm text-error">
          {formError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm sm:btn-md" disabled={pending}>
          {pending ? 'হালনাগাদ হচ্ছে…' : 'Update Information'}
        </button>
        <Link href="/profile" className="btn btn-ghost btn-sm sm:btn-md">
          বাতিল
        </Link>
      </div>
    </form>
  )
}
