import Link from "next/link"
import { getMember } from "@/lib/session"
import { query } from "@/lib/sql"
import { catalogOptions, loadLinks } from "@/lib/entities"
import { one, pageOf, PAGE_SIZE, sortOf, withParams, type Params } from "@/lib/list-params"
import { ColumnPicker } from "@/components/column-picker"
import { Chip, Chips, names } from "@/components/chips"
import { Pager } from "@/components/pager"

const COLUMNS = [
  { key: "numero", label: "Número" }, { key: "fuero", label: "Fuero" }, { key: "estado", label: "Estado" },
  { key: "etapa", label: "Etapa" }, { key: "juzgado", label: "Radicación" }, { key: "clientes", label: "Clientes" },
  { key: "asignados", label: "Asignados" }, { key: "etiquetas", label: "Etiquetas" }, { key: "actividad", label: "Última actividad" },
]
const VIEWS = [
  { id: "", label: "Activos" },
  { id: "terminadas", label: "Parecen terminadas", hint: "Sin movimiento hace más de 2 años, para revisarlas y archivarlas" },
  { id: "archivo", label: "Archivo" },
  { id: "papelera", label: "Papelera" },
]
const fmt = (d: Date | null) => (d ? new Date(d).toLocaleDateString("es-AR") : "—")

export default async function MattersPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { studio, user } = await getMember()
  const params = await searchParams
  const view = one(params.vista)
  const q = one(params.q).trim()
  const mine = one(params.mios) === "1"
  const page = pageOf(params)
  const sort = sortOf(params, { caption: "m.caption", updated: "m.updated_at", activity: "m.last_activity_at" } as Record<string, string>, "updated")
  const sortSql = sort.key === "updated" && !one(params.dir) ? "m.updated_at desc" : `${sort.sql} nulls last`

  const where = ["m.studio_id = $1"]
  const args: unknown[] = [studio.id]
  if (view === "papelera") where.push("m.deleted_at is not null")
  else where.push("m.deleted_at is null", view === "archivo" ? "m.archived" : "not m.archived")
  if (view === "terminadas") where.push(`coalesce(m.last_activity_at, m.created_at) < now() - interval '2 years'`)
  if (mine) { args.push(user.id); where.push(`exists (select 1 from assignments a where a.entity = 'matter' and a.entity_id = m.id and a.user_id = $${args.length})`) }
  if (q) {
    args.push(`%${q}%`)
    const p = `$${args.length}`
    where.push(`(m.caption ilike ${p} or coalesce(m.number, '') ilike ${p} or coalesce(m.full_number, '') ilike ${p}
      or exists (select 1 from matter_clients mc join clients c on c.id = mc.client_id where mc.matter_id = m.id and c.name ilike ${p}))`)
  }
  for (const [param, column] of [["estado", "estado_id"], ["etapa", "etapa_id"], ["fuero", "fuero_id"]] as const) {
    const value = one(params[param])
    if (/^[0-9a-f-]{36}$/i.test(value)) { args.push(value); where.push(`m.${column} = $${args.length}`) }
  }

  const rows = await query<Record<string, any>>(
    `select m.id, m.caption, m.number, m.year, m.last_activity_at,
            f.name as fuero, e.name as estado, e.color as estado_color, s.name as etapa, s.color as etapa_color, ct.name as juzgado,
            (select string_agg(c.name, ', ' order by c.name) from matter_clients mc join clients c on c.id = mc.client_id where mc.matter_id = m.id) as clientes,
            count(*) over () as total
     from matters m
     left join catalog_items f on f.id = m.fuero_id left join catalog_items e on e.id = m.estado_id
     left join catalog_items s on s.id = m.etapa_id left join courts ct on ct.id = m.court_id
     where ${where.join(" and ")} order by ${sortSql} limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`,
    args,
  )
  const total = Number(rows[0]?.total ?? 0)
  const links = await loadLinks("matter", rows.map((r) => r.id))
  const [estados, etapas, fueros] = await Promise.all([
    catalogOptions(studio.id, "estado"), catalogOptions(studio.id, "etapa"), catalogOptions(studio.id, "fuero"),
  ])
  const sortLink = (key: string, label: string) => (
    <Link href={withParams("/expedientes", params, { sort: key, dir: sort.key === key && sort.dir === "asc" ? "desc" : "asc" })} className="hover:underline">
      {label} {sort.key === key ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
    </Link>
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Expedientes</h1>
          <p className="text-sm text-ink-soft">{total} resultado{total === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-2">
          <ColumnPicker tableId="tabla-expedientes" columns={COLUMNS} />
          <Link href="/expedientes/nuevo" className="btn">+ Nuevo expediente</Link>
        </div>
      </div>

      <nav className="mb-3 flex flex-wrap gap-1 border-b border-line" aria-label="Vistas">
        {VIEWS.map((v) => (
          <Link key={v.id} title={v.hint} href={withParams("/expedientes", params, { vista: v.id || null })}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${view === v.id ? "border-brand font-medium" : "border-transparent text-ink-soft hover:text-ink"}`}>
            {v.label}
          </Link>
        ))}
      </nav>

      <form className="mb-4 flex flex-wrap items-center gap-2" action="/expedientes">
        {view && <input type="hidden" name="vista" value={view} />}
        <input name="q" defaultValue={q} placeholder="Carátula, número o cliente" aria-label="Buscar" className="input w-64" />
        {([["estado", "Estado", estados], ["etapa", "Etapa", etapas], ["fuero", "Fuero", fueros]] as const).map(([name, label, opts]) => (
          <select key={name} name={name} defaultValue={one(params[name])} aria-label={label} className="input w-auto">
            <option value="">{label}: todos</option>
            {opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        ))}
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="mios" value="1" defaultChecked={mine} /> Asignados a mí</label>
        <button className="btn-ghost">Filtrar</button>
      </form>

      <div className="card overflow-x-auto">
        <table id="tabla-expedientes" className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="p-3">{sortLink("caption", "Carátula")}</th>
              {COLUMNS.map((c) => <th key={c.key} data-col={c.key} className="p-3 whitespace-nowrap">{c.key === "actividad" ? sortLink("activity", c.label) : c.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={COLUMNS.length + 1} className="p-8 text-center text-ink-soft">
                {view === "archivo" ? "El Archivo está vacío. Ahí quedan los expedientes que archives."
                  : view === "papelera" ? "La papelera está vacía."
                  : q || mine ? "No hay expedientes con estos filtros."
                  : <>Todavía no hay expedientes. <Link href="/expedientes/nuevo" className="text-brand underline">Cargá el primero</Link></>}
              </td></tr>
            )}
            {rows.map((r) => {
              const l = links.get(r.id)!
              return (
                <tr key={r.id} className="hover:bg-paper">
                  <td className="max-w-md p-3 font-medium"><Link href={`/expedientes/${r.id}`} className="hover:underline">{r.caption}</Link></td>
                  <td data-col="numero" className="p-3 whitespace-nowrap">{[r.number, r.year].filter(Boolean).join("/") || "—"}</td>
                  <td data-col="fuero" className="p-3">{r.fuero ?? "—"}</td>
                  <td data-col="estado" className="p-3">{r.estado ? <Chip name={r.estado} color={r.estado_color} /> : "—"}</td>
                  <td data-col="etapa" className="p-3">{r.etapa ? <Chip name={r.etapa} color={r.etapa_color} /> : "—"}</td>
                  <td data-col="juzgado" className="p-3">{r.juzgado ?? "—"}</td>
                  <td data-col="clientes" className="p-3">{r.clientes ?? "—"}</td>
                  <td data-col="asignados" className="p-3">{names(l.assignees)}</td>
                  <td data-col="etiquetas" className="p-3"><Chips items={l.tags} /></td>
                  <td data-col="actividad" className="p-3 whitespace-nowrap">{fmt(r.last_activity_at)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pager path="/expedientes" params={params} page={page} total={total} />
    </div>
  )
}
