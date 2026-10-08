import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents is left OFF on purpose. With it on, every component that
  // reads cookies/headers (which BetterAuth does) must sit inside a Suspense
  // boundary, which makes auth and protected routes much harder to get right.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
