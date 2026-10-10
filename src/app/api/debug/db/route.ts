import { MongoClient } from 'mongodb'

/** TEMPORARY diagnostic route — delete once the production database connects.
 *
 *  Production was returning an empty 500 for every auth request with nothing
 *  readable from outside. This reports the *shape* of the configured
 *  connection string and the driver's own error, and never the credentials:
 *  the password is redacted from every string before it leaves the server. */

export const dynamic = 'force-dynamic'

/** Replaces the user:password segment of anything that looks like a URI. */
function redact(text: string): string {
  return text.replace(/\/\/[^@\s]*@/g, '//<redacted>@')
}

function describe(name: string) {
  const raw = process.env[name]
  if (raw === undefined) return { present: false }

  const trimmed = raw.trim()
  return {
    present: true,
    length: raw.length,
    hasSurroundingWhitespace: raw !== trimmed,
    startsWithVariableName: trimmed.startsWith(`${name}=`),
    startsWithQuote: trimmed.startsWith('"') || trimmed.startsWith("'"),
    endsWithQuote: trimmed.endsWith('"') || trimmed.endsWith("'"),
    firstTwelveCharacters: trimmed.slice(0, 12),
  }
}

export async function GET() {
  const report: Record<string, unknown> = {
    MONGODB_URI: describe('MONGODB_URI'),
    BETTER_AUTH_SECRET: { present: Boolean(process.env.BETTER_AUTH_SECRET) },
    BETTER_AUTH_URL: describe('BETTER_AUTH_URL'),
    NEXT_PUBLIC_APP_URL: describe('NEXT_PUBLIC_APP_URL'),
  }

  const { auth } = await import('@/lib/auth').catch((error: unknown) => {
    report.authModule = { loaded: false, error: redact(String(error)) }
    return { auth: null }
  })
  if (auth) report.authModule = { loaded: true }

  const raw = process.env.MONGODB_URI
  if (raw) {
    let value = raw.trim()
    if (value.startsWith('MONGODB_URI=')) value = value.slice('MONGODB_URI='.length).trim()
    const first = value[0]
    if (value.length >= 2 && (first === '"' || first === "'") && value.endsWith(first)) {
      value = value.slice(1, -1).trim()
    }

    let client: MongoClient | null = null
    try {
      client = new MongoClient(value, { serverSelectionTimeoutMS: 8000 })
      await client.db().command({ ping: 1 })
      report.connection = { ok: true, database: client.db().databaseName }
    } catch (error) {
      const err = error as { name?: string; message?: string; code?: unknown }
      report.connection = {
        ok: false,
        name: err.name ?? 'Unknown',
        code: err.code ?? null,
        message: redact(err.message ?? String(error)).slice(0, 400),
      }
    } finally {
      await client?.close().catch(() => {})
    }
  }

  return Response.json(report)
}
