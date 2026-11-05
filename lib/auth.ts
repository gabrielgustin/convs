import "server-only"
import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { PostgresDialect } from "kysely"
import { getPool } from "@/lib/sql"
import { linkMail, sendMail } from "@/lib/mail"

function resolveBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return undefined // en local se toma del pedido
}

function resolveTrustedOrigins() {
  const origins: string[] = []
  if (process.env.BETTER_AUTH_URL) origins.push(process.env.BETTER_AUTH_URL)
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  if (process.env.NODE_ENV === "development") origins.push("http://localhost:*", "http://127.0.0.1:*")
  return origins
}

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

async function createAuth() {
  return betterAuth({
    database: { dialect: new PostgresDialect({ pool: await getPool() }), type: "postgres" },
    baseURL: resolveBaseURL(),
    // En local hay un secreto fijo de desarrollo; en producción BETTER_AUTH_SECRET es obligatorio.
    secret: process.env.BETTER_AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : "estudio-juridico-dev-secret"),
    trustedOrigins: resolveTrustedOrigins(),
    rateLimit: { enabled: true, window: 60, max: 30 },
    session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      sendResetPassword: async ({ user, url }) =>
        sendMail(user.email, "Restablecer tu contraseña", linkMail("Pediste restablecer tu contraseña.", url, "Elegir una contraseña nueva")),
    },
    socialProviders: googleEnabled
      ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! } }
      : undefined,
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => sendMail(email, "Tu link para entrar", linkMail("Tocá el link para entrar a tu estudio.", url, "Entrar")),
      }),
    ],
  })
}

type Auth = Awaited<ReturnType<typeof createAuth>>
const globalStore = globalThis as unknown as { __ejAuth?: Promise<Auth> }

export function getAuth(): Promise<Auth> {
  globalStore.__ejAuth ??= createAuth()
  return globalStore.__ejAuth
}
