import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const origins = [
  ...(process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:3000',
        ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
        ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []),
        ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []),
        ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : []),
      ]
    : []),
  ...(process.env.NODE_ENV === 'production'
    ? [
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
      ]
    : []),
]

// Solo estos emails (separados por coma, en Vercel) pueden registrarse y editar contenido. Vacío = nadie.
const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
export const isAdminEmail = (email?: string | null) => !!email && adminEmails.includes(email.toLowerCase())

export const auth = betterAuth({
  databaseHooks: { user: { create: { before: async (user) => (isAdminEmail(user.email) ? undefined : false) } } },
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL),
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: origins,
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
})
