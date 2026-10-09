'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserMenu, { type SessionUser } from '@/components/UserMenu'
import type { Category } from '@/lib/api'
import { banglaDate } from '@/lib/bn'

export default function Navbar({
  categories,
  user,
}: {
  categories: Category[]
  user: SessionUser | null
}) {
  const pathname = usePathname()
  const [today, setToday] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // Server and browser can disagree on the date, so this must run on the client only.
  useEffect(() => {
    setToday(banglaDate())
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const categoryHref = (slug: string) => `/category/${slug}`

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="flex items-center gap-2 text-lg font-bold">
            <span aria-hidden="true">🛒</span> বাজার দর
          </span>
          <span className="min-h-[1em] text-xs text-base-content/60">{today}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {categories.map((category) => {
            const href = categoryHref(category.slug)
            const active = pathname === href
            return (
              <Link
                key={category.slug}
                href={href}
                className={`rounded-field px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content hover:bg-base-200'
                }`}
              >
                <span aria-hidden="true">{category.icon}</span> {category.nameBn}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm btn-ghost">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-sm btn-primary">
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm lg:hidden"
          aria-label={menuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-base-300 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {categories.map((category) => {
              const href = categoryHref(category.slug)
              const active = pathname === href
              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={`rounded-field px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-content'
                      : 'text-base-content hover:bg-base-200'
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span> {category.nameBn}
                </Link>
              )
            })}
          </nav>
          <div className="mt-3">
            {user ? (
              <UserMenu user={user} stacked />
            ) : (
              <div className="flex gap-2">
                <Link href="/signin" className="btn btn-sm btn-ghost flex-1">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-sm btn-primary flex-1">
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
