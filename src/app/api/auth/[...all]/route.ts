import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

const { GET: betterAuthGET, POST: betterAuthPOST } = toNextJsHandler(auth)

// BetterAuth only logs a clean message for its own APIError instances.
// A raw driver failure (e.g. MongoServerError on a bad connection string)
// escapes uncaught and Next.js turns it into an empty 500 in production,
// so this tags it clearly in the Vercel function logs before that happens.
async function withMongoErrorLogging(handler: (request: Request) => Promise<Response>, request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error('[auth] request failed before a response could be built:', error)
    throw error
  }
}

export const GET = (request: Request) => withMongoErrorLogging(betterAuthGET, request)
export const POST = (request: Request) => withMongoErrorLogging(betterAuthPOST, request)
