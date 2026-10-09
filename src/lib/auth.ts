import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { nextCookies } from 'better-auth/next-js'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  // In production a missing database is a hard failure — fail loudly at boot.
  // In development we keep the site renderable so the public pages still work
  // while the Atlas connection string is being set up.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI is not set. Add it to the environment before deploying.')
  }
  console.warn('[auth] MONGODB_URI is not set — sign in and sign up will not work yet.')
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

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
  }

  return providers
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
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
