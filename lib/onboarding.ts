export type Role = "admin" | "abogado" | "asistente"
export const ROLES: { id: Role; label: string }[] = [
  { id: "admin", label: "Administrador" },
  { id: "abogado", label: "Abogado" },
  { id: "asistente", label: "Asistente" },
]

type Invite = { studio_id: string; role: Role }
type Domain = { studio_id: string; domain: string; verified_at: Date | string | null }

export type JoinDecision = { action: "join"; studioId: string; role: Role; via: "invitation" | "domain" } | { action: "create" }

export const emailDomain = (email: string) => email.trim().toLowerCase().split("@").pop() ?? ""

/**
 * A qué estudio entra una persona la primera vez que inicia sesión.
 * Primero gana una invitación; si no hay, un dominio verificado que coincida con su email; si no, arma su propio estudio.
 */
export function decideJoin(email: string, invites: Invite[], domains: Domain[]): JoinDecision {
  if (invites.length) return { action: "join", studioId: invites[0].studio_id, role: invites[0].role, via: "invitation" }
  const domain = emailDomain(email)
  const match = domains.find((d) => d.verified_at && d.domain === domain)
  if (match) return { action: "join", studioId: match.studio_id, role: "abogado", via: "domain" }
  return { action: "create" }
}

// Dominios de correo públicos: nadie puede reclamarlos para su estudio.
export const PUBLIC_EMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com", "hotmail.com", "outlook.com", "live.com", "yahoo.com", "yahoo.com.ar", "icloud.com", "proton.me", "protonmail.com"])

export const DOMAIN_RE = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/
