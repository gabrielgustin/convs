import Link from "next/link"
import { getMember } from "@/lib/session"
import { query } from "@/lib/sql"
import { CONTACTS, type ContactEntity } from "@/lib/contacts"
import { catalogOptions, loadLinks } from "@/lib/entities"
import { one, pageOf, PAGE_SIZE, sortOf, withParams, type Params } from "@/lib/list-params"
import { ColumnPicker } from "@/components/column-picker"
import { Chip, Chips, names } from "@/components/chips"
import { Pager } from "@/components/pager"

const LABELS: Record<string, string> = {
  type: "Tipo", status: "Estado", assignees: "Asignados", tags: "Etiquetas", email: "Email", phone: "Teléfono",
  province: "Provincia", identification: "Identificación", address: "Dirección", matters: "Asuntos",
}

export async function ContactList({ entity, params, extraActions }: { entity: ContactEntity; params: Params; extraActions?: React.ReactNode }) {
  const { studio, user } = await getMember()
  const config = CONTACTS[entity]
  const status = one(params.estado) || "activos"
  const type = one(params.tipo)
  const mine = one(params.mios) === "1"
  const q = one(params.q).trim()
  const page = pageOf(params)
  const sort = sortOf(params, { name: "x.name", type: "t.name", matters: "matters", email: "x.email", province: "x.province" } as Record<string, string>, "name")

  const where = ["x.studio_id = $1"]
  const args: unknown[] = [studio.id]
  if (status === "activos") where.push("x.active")
  if (status === "inactivos") where.push("not x.active")
  if (type) { args.push(type); where.push(`x.type_id = $${args.length}`) }
  if (mine) { args.push(user.id); where.push(`exists (select 1 from assignments a where a.entity = '${entity}' and a.entity_id = x.id and a.user_id = $${args.length})`) }
  if (q) { args.push(`%${q}%`); where.push(`(x.name ilike $${args.length} or coalesce(x.email, '') ilike $${args.length})`) }

  const fieldCols = config.columns.map((c) => `x.${c}`).join(", ")
  const rows = await query<Record<string, any>>(
    `select x.id, x.name, x.active, ${fieldCols}, t.name as type_name, t.color as type_color, ${config.mattersCount} as matters,
            count(*) over () as total
     from ${config.table} x left join catalog_items t on t.id = x.type_id
     where ${where.join(" and ")} order by ${sort.sql}, x.name limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`,
    args,
  )
  const total = Number(rows[0]?.total ?? 0)
  const links = await loadLinks(entity, rows.map((r) => r.id))
  const types = await catalogOptions(studio.id, config.typeKind)
  const columns = ["type", "status", "assignees", "tags", ...config.columns, "matters"]
  const tableId = `tabla-${entity}`
  const path = config.path

  const sortHeader = (key: string) => {
    const sortable = ["type", "matters", "email", "province"].includes(key)
    if (!sortable) return LABELS[key]
    const dir = sort.key === key && sort.dir === "asc" ? "desc" : "asc"
    return <Link href={withParams(path, params, { sort: key, dir })} className="hover:underline">{LABELS[key]} {sort.key === key ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}</Link>
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{config.plural}</h1>
          <p className="text-sm text-ink-soft">{total} {total === 1 ? config.singular : `${config.singular}s`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          <ColumnPicker tableId={tableId} columns={columns.map((key) => ({ key, label: LABELS[key] }))} />
          <Link href={`${path}/nuevo`} className="btn">+ Nuevo {config.singular}</Link>
        </div>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-2" action={path}>
        <input name="q" defaultValue={q} placeholder="Buscar por nombre o email" aria-label="Buscar" className="input w-64" />
        <select name="estado" defaultValue={status} aria-label="Estado" className="input w-auto">
          <option value="activos">Activos</option><option value="inactivos">Inactivos</option><option value="todos">Todos</option>
        </select>
        <select name="tipo" defaultValue={type} aria-label="Tipo" className="input w-auto">
          <option value="">Todos los tipos</option>
          {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="mios" value="1" defaultChecked={mine} /> Asignados a mí</label>
        <button className="btn-ghost">Filtrar</button>
      </form>

      <div className="card overflow-x-auto">
        <table id={tableId} className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="p-3"><Link href={withParams(path, params, { sort: "name", dir: sort.key === "name" && sort.dir === "asc" ? "desc" : "asc" })} className="hover:underline">Nombre {sort.key === "name" ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
              {columns.map((key) => <th key={key} data-col={key} className="p-3 whitespace-nowrap">{sortHeader(key)}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="p-6 text-center text-ink-soft">No hay {config.plural.toLowerCase()} con estos filtros.</td></tr>}
            {rows.map((r) => {
              const l = links.get(r.id)!
              return (
                <tr key={r.id} className="hover:bg-paper">
                  <td className="p-3 font-medium"><Link href={`${path}/${r.id}`} className="hover:underline">{r.name}</Link></td>
                  <td data-col="type" className="p-3">{r.type_name ? <Chip name={r.type_name} color={r.type_color} /> : "—"}</td>
                  <td data-col="status" className="p-3">{r.active ? "Activo" : "Inactivo"}</td>
                  <td data-col="assignees" className="p-3">{names(l.assignees)}</td>
                  <td data-col="tags" className="p-3"><Chips items={l.tags} /></td>
                  {config.columns.map((c) => <td key={c} data-col={c} className="p-3">{r[c] || "—"}</td>)}
                  <td data-col="matters" className="p-3">{Number(r.matters)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pager path={path} params={params} page={page} total={total} />
    </div>
  )
}
