import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// Edge-compatible config (no Prisma) - used by middleware
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  trustHost: true,
} satisfies NextAuthConfig
