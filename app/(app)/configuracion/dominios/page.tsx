import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { ActionForm } from "@/components/action-form"
import { addDomain } from "../actions"
import { DomainRow } from "./domain-row"

export default async function DomainsPage() {
  const { studio, role } = await getMember()
  const domains = await sql<{ id: string; domain: string; token: string; verified_at: Date | null }>`
    select id, domain, token, verified_at from domains where studio_id = ${studio.id} order by created_at`
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-medium">Dominios</h2>
        <p className="text-sm text-ink-soft">Con un dominio verificado, cualquiera que entre con un email de ese dominio se suma solo al estudio como abogado.</p>
      </div>
      {role === "admin" && (
        <ActionForm action={addDomain} submit="Agregar" className="card flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-56 flex-1">
            <label className="label" htmlFor="domain">Dominio</label>
            <input id="domain" name="domain" placeholder="miestudio.com.ar" className="input" required />
          </div>
        </ActionForm>
      )}
      {domains.length === 0 && <p className="text-sm text-ink-soft">Todavía no hay dominios.</p>}
      {domains.map((d) => <DomainRow key={d.id} domain={{ ...d, verified: Boolean(d.verified_at) }} canEdit={role === "admin"} />)}
    </div>
  )
}
