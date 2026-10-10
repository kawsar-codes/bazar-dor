import { createAuthClient } from 'better-auth/react'

/** Strips the quotes a .env value often still carries when it is pasted into a
 *  hosting dashboard, which stores it verbatim. Returns undefined when nothing
 *  usable is left, so the client falls back to the page's own origin. */
function publicBaseURL(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_APP_URL
  if (!raw) return undefined

  let value = raw.trim()
  const first = value[0]
  if (value.length >= 2 && (first === '"' || first === "'") && value.endsWith(first)) {
    value = value.slice(1, -1).trim()
  }

  return value === '' ? undefined : value
}

export const authClient = createAuthClient({
  // Left undefined on purpose when the variable is missing or malformed:
  // BetterAuth then talks to the origin the page is already served from, which
  // is correct on localhost, on Vercel previews and in production alike.
  baseURL: publicBaseURL(),
})

export const { signIn, signUp, signOut, useSession } = authClient
