import Link from "next/link"
import { getMember } from "@/lib/session"
import { query } from "@/lib/sql"
import { PROVINCES } from "@/lib/contacts"
import { one, type Params } from "@/lib/list-params"
import { ActionForm } from "@/components/action-form"
import { importFromDirectory } from "@/lib/actions/directory"

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { studio } = await getMember()
  const params = await searchParams
  const q = one(params.q).trim()
  const province = one(params.provincia)

  const where: string[] = []
  const args: unknown[] = [studio.id]
  if (q) { args.push(`%${q}%`); where.push(`d.name ilike $${args.length}`) }
  if (province) { args.push(province); where.push(`d.province = $${args.length}`) }
  const rows = await query<{ id: string; name: string; jurisdiction: string | null; province: string | null; already: boolean }>(
    `select d.id, d.name, d.jurisdiction, d.province,
            exists (select 1 from courts c where c.studio_id = $1 and lower(c.name) = lower(d.name)) as already
     from court_directory d ${where.length ? `where ${where.join(" and ")}` : ""} order by d.province, d.name limit 200`,
    args,
  )
  const [{ count }] = await query<{ count: string }>(`select count(*) from court_directory`)

  return (
    <div className="max-w-4xl space-y-4">
      <Link href="/juzgados" className="text-sm text-ink-soft hover:underline">← Juzgados</Link>
      <h1 className="font-serif text-3xl">Directorio de juzgados</h1>
      <p className="text-sm text-ink-soft">Buscá en el directorio nacional y cargá varios juzgados de una sola vez.</p>

      {Number(count) === 0 ? (
        <div className="card p-5 text-sm text-ink-soft">El directorio todavía no tiene datos cargados. Mientras tanto podés cargar juzgados a mano.</div>
      ) : (
        <>
          <form className="flex flex-wrap gap-2" action="/juzgados/directorio">
            <input name="q" defaultValue={q} placeholder="Nombre del juzgado" aria-label="Buscar" className="input w-72" />
            <select name="provincia" defaultValue={province} aria-label="Provincia" className="input w-auto">
              <option value="">Todas las provincias</option>
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <button className="btn-ghost">Buscar</button>
          </form>
          <ActionForm action={importFromDirectory} submit="Agregar seleccionados" className="space-y-3">
            <div className="card divide-y divide-line">
              {rows.length === 0 && <p className="p-4 text-sm text-ink-soft">Sin resultados.</p>}
              {rows.map((r) => (
                <label key={r.id} className={`flex items-center gap-3 p-3 text-sm ${r.already ? "opacity-60" : ""}`}>
                  <input type="checkbox" name="ids" value={r.id} disabled={r.already} />
                  <span className="flex-1">{r.name}</span>
                  <span className="text-ink-soft">{[r.jurisdiction, r.province].filter(Boolean).join(" · ")}</span>
                  {r.already && <span className="text-xs">Ya cargado</span>}
                </label>
              ))}
            </div>
          </ActionForm>
        </>
      )}
    </div>
  )
}
