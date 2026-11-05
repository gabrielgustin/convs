import "server-only"
import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuth } from "@/lib/auth"
import { sql, transaction, type Queryable } from "@/lib/sql"
import { DEFAULT_CATALOGS, type CatalogKind } from "@/lib/catalogs"
import { decideJoin, type Role } from "@/lib/onboarding"

export type Member = {
  user: { id: string; name: string; email: string; image?: string | null }
  studio: { id: string; name: string; logo: string | null; plan: string }
  role: Role
}

async function seedCatalogs(tx: Queryable, studioId: string) {
  for (const [kind, items] of Object.entries(DEFAULT_CATALOGS) as [CatalogKind, (typeof DEFAULT_CATALOGS)[CatalogKind]][]) {
    for (const [sort, item] of items.entries()) {
      await tx.query(`insert into catalog_items (studio_id, kind, name, color, category, sort) values ($1, $2, $3, $4, $5, $6)`, [
        studioId, kind, item.name, item.color, "category" in item ? item.category : null, sort,
      ])
    }
  }
}

/** Primera vez que entra: se une al estudio que lo invitó o cuyo dominio coincide, o se le arma uno propio. */
async function onboard(user: Member["user"]) {
  const email = user.email.toLowerCase()
  await transaction(async (tx) => {
    const invites = await tx.sql<{ id: string; studio_id: string; role: Role }>`
      select i.id, i.studio_id, i.role from invitations i join studios s on s.id = i.studio_id
      where lower(i.email) = ${email} and s.deleted_at is null order by i.created_at`
    const domains = await tx.sql<{ studio_id: string; domain: string; verified_at: Date | null }>`
      select d.studio_id, d.domain, d.verified_at from domains d join studios s on s.id = d.studio_id where s.deleted_at is null`
    const decision = decideJoin(email, invites, domains)

    if (decision.action === "join") {
      await tx.sql`insert into members (studio_id, user_id, role) values (${decision.studioId}, ${user.id}, ${decision.role}) on conflict do nothing`
      await tx.sql`delete from invitations where lower(email) = ${email} and studio_id = ${decision.studioId}`
      return
    }
    const name = `Estudio de ${user.name || email.split("@")[0]}`
    const [studio] = await tx.sql<{ id: string }>`insert into studios (name) values (${name}) returning id`
    await tx.sql`insert into members (studio_id, user_id, role) values (${studio.id}, ${user.id}, 'admin')`
    await seedCatalogs(tx, studio.id)
  })
}

async function findMembership(userId: string) {
  const [row] = await sql<{ role: Role; active: boolean; id: string; name: string; logo: string | null; plan: string; deleted_at: Date | null }>`
    select m.role, m.active, s.id, s.name, s.logo, s.plan, s.deleted_at
    from members m join studios s on s.id = m.studio_id where m.user_id = ${userId}
    order by m.active desc, s.deleted_at nulls first, m.created_at limit 1`
  return row
}

/** Sesión + estudio del usuario. Redirige al login si no hay sesión; corta si está desactivado. */
export const getMember = cache(async (): Promise<Member> => {
  const session = await (await getAuth()).api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  const user = { id: session.user.id, name: session.user.name, email: session.user.email, image: session.user.image }

  let row = await findMembership(user.id)
  if (!row) {
    await onboard(user)
    row = await findMembership(user.id)
  }
  if (!row || !row.active || row.deleted_at) redirect("/sin-acceso")
  return { user, role: row.role, studio: { id: row.id, name: row.name, logo: row.logo, plan: row.plan } }
})

/** Igual que getMember pero solo para administradores del estudio (acciones de configuración). */
export async function requireAdmin() {
  const member = await getMember()
  if (member.role !== "admin") throw new Error("Solo un administrador del estudio puede hacer esto.")
  return member
}
