import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { ROLES, type Role } from "@/lib/onboarding"
import { ActionForm } from "@/components/action-form"
import { inviteUser } from "../actions"
import { InviteRow, MemberRow } from "./rows"

export default async function UsersPage() {
  const { studio, role, user } = await getMember()
  const admin = role === "admin"
  const members = await sql<{ user_id: string; name: string; email: string; role: Role; active: boolean }>`
    select m.user_id, u.name, u.email, m.role, m.active from members m join "user" u on u.id = m.user_id
    where m.studio_id = ${studio.id} order by m.active desc, u.name`
  const invites = await sql<{ id: string; email: string; role: Role }>`
    select id, email, role from invitations where studio_id = ${studio.id} order by created_at`

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-medium">Usuarios del estudio</h2>
        <p className="text-sm text-ink-soft">Invitá al equipo, también con Gmail personales. Entran con Google, contraseña o link por email; solo acceden los invitados acá o los que tengan un email de un dominio verificado.</p>
      </div>

      {admin && (
        <ActionForm action={inviteUser} submit="Invitar" className="card flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-56 flex-1">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="role">Rol</label>
            <select id="role" name="role" defaultValue="abogado" className="input">
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
        </ActionForm>
      )}

      <div className="card divide-y divide-line">
        {members.map((m) => <MemberRow key={m.user_id} member={m} isSelf={m.user_id === user.id} canEdit={admin} />)}
        {invites.map((i) => <InviteRow key={i.id} invite={i} canEdit={admin} />)}
      </div>
    </div>
  )
}
