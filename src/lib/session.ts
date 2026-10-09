import { headers } from 'next/headers'
import { auth } from './auth'

export type AppSession = Awaited<ReturnType<typeof auth.api.getSession>>

/** Reads the current session on the server.
 *
 *  Returns null instead of throwing when the database is unreachable, so a
 *  misconfigured connection string degrades to "logged out" rather than taking
 *  down every page that renders the navbar. */
export async function getSession(): Promise<AppSession> {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error('[auth] could not read session:', error)
    return null
  }
}
