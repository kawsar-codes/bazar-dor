import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'
import { MongoClient } from 'mongodb'

/** Reads an environment variable defensively.
 *
 *  A value copied straight out of a .env file often still carries its wrapping
 *  quotes, and dashboards like Vercel's store what you paste verbatim — so
 *  `MONGODB_URI="mongodb+srv://…"` arrives with the quotes as part of the
 *  string and every connection fails. Trimming whitespace and stripping a
 *  matched pair of quotes makes the app forgiving of that very easy mistake. */
function readEnv(name: string): string | undefined {
  const raw = process.env[name]
  if (raw === undefined) return undefined

  let value = raw.trim()

  // A whole .env line pasted into a dashboard keeps its `NAME=` prefix.
  if (value.startsWith(`${name}=`)) value = value.slice(name.length + 1).trim()

  // ...and its wrapping quotes, which the dashboard stores verbatim.
  const first = value[0]
  if (value.length >= 2 && (first === '"' || first === "'") && value.endsWith(first)) {
    value = value.slice(1, -1).trim()
  }

  // Strip once more in case the line was pasted as `NAME="value"`.
  if (value.startsWith(`${name}=`)) value = value.slice(name.length + 1).trim()

  return value === '' ? undefined : value
}

/** The public origin of this deployment.
 *
 *  BETTER_AUTH_URL wins when it is set. Otherwise Vercel's own variables give
 *  the right answer without anyone having to keep a URL in sync by hand. */
function resolveBaseURL(): string | undefined {
  const configured = readEnv('BETTER_AUTH_URL')
  if (configured) return configured

  const vercelHost =
    readEnv('VERCEL_PROJECT_PRODUCTION_URL') ?? readEnv('VERCEL_URL')
  return vercelHost ? `https://${vercelHost}` : undefined
}

const uri = readEnv('MONGODB_URI')

if (!uri) {
  // In production a missing database is a hard failure — fail loudly at boot.
  // In development we keep the site renderable so the public pages still work
  // while the Atlas connection string is being set up.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI is not set. Add it to the environment before deploying.')
  }
  console.warn('[auth] MONGODB_URI is not set — sign in and sign up will not work yet.')
}

if (uri && !/^mongodb(\+srv)?:\/\//.test(uri)) {
  // Fail with a message that names the real problem. Left unchecked, the driver
  // throws while this module is first imported, which Next.js turns into an
  // empty 500 on every auth request with nothing useful in the logs.
  console.error(
    `[auth] MONGODB_URI does not start with mongodb:// or mongodb+srv:// — it begins with "${uri.slice(0, 12)}". Paste only the connection string itself, with no variable name and no quotes.`,
  )
}

const connectionString = uri ?? 'mongodb://127.0.0.1:27017/bazar-dor-unconfigured'

// Next.js reloads modules on every edit in dev, and serverless invocations reuse
// the process in production. Caching the client avoids opening a new connection
// pool each time.
const globalForMongo = globalThis as unknown as { bazarDorMongoClient?: MongoClient }
const client = globalForMongo.bazarDorMongoClient ?? new MongoClient(connectionString)
if (process.env.NODE_ENV !== 'production') globalForMongo.bazarDorMongoClient = client

/** Only the providers whose credentials are actually present get registered, so
 *  the app still boots before the Google/GitHub keys are filled in. */
function configuredSocialProviders(): BetterAuthOptions['socialProviders'] {
  const providers: NonNullable<BetterAuthOptions['socialProviders']> = {}

  const googleId = readEnv('GOOGLE_CLIENT_ID')
  const googleSecret = readEnv('GOOGLE_CLIENT_SECRET')
  if (googleId && googleSecret) {
    providers.google = { clientId: googleId, clientSecret: googleSecret }
  }

  const githubId = readEnv('GITHUB_CLIENT_ID')
  const githubSecret = readEnv('GITHUB_CLIENT_SECRET')
  if (githubId && githubSecret) {
    providers.github = { clientId: githubId, clientSecret: githubSecret }
  }

  return providers
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), { client }),
  secret: readEnv('BETTER_AUTH_SECRET'),
  baseURL: resolveBaseURL(),
  emailAndPassword: {
    enabled: true,
    // The assignment asks for a redirect to the sign-in page after registering,
    // so do not sign the user in automatically.
    autoSignIn: false,
    // Deliberately no email verification and no password reset — the assignment
    // says not to implement them.
  },
  socialProviders: configuredSocialProviders(),
  plugins: [nextCookies()],
})
