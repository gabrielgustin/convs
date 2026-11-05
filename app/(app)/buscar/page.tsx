import Link from "next/link"
import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { one, type Params } from "@/lib/list-params"

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { studio } = await getMember()
  const q = one((await searchParams).q).trim().slice(0, 100)
  const like = `%${q}%`
  const [matters, clients, courts] = q
    ? await Promise.all([
        sql<{ id: string; name: string; extra: string | null }>`
          select id, caption as name, concat_ws(' · ', nullif(concat_ws('/', number, year::text), ''), case when archived then 'Archivado' end) as extra
          from matters where studio_id = ${studio.id} and deleted_at is null
            and (caption ilike ${like} or number ilike ${like} or full_number ilike ${like}) order by updated_at desc limit 20`,
        sql<{ id: string; name: string; extra: string | null }>`
          select id, name, email as extra from clients where studio_id = ${studio.id}
            and (name ilike ${like} or email ilike ${like} or tax_id ilike ${like}) order by name limit 20`,
        sql<{ id: string; name: string; extra: string | null }>`
          select id, name, province as extra from courts where studio_id = ${studio.id} and name ilike ${like} order by name limit 20`,
      ])
    : [[], [], []]

  const groups = [
    { title: "Expedientes", path: "/expedientes", rows: matters },
    { title: "Clientes", path: "/clientes", rows: clients },
    { title: "Juzgados", path: "/juzgados", rows: courts },
  ]
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl">Buscar en el estudio</h1>
      <form action="/buscar"><input name="q" defaultValue={q} autoFocus placeholder="Carátula, número, cliente o juzgado" aria-label="Buscar" className="input" /></form>
      {q && groups.every((g) => g.rows.length === 0) && <p className="text-ink-soft">Sin resultados para «{q}».</p>}
      {groups.filter((g) => g.rows.length).map((g) => (
        <section key={g.title}>
          <h2 className="label">{g.title}</h2>
          <ul className="card divide-y divide-line">
            {g.rows.map((r) => (
              <li key={r.id}><Link href={`${g.path}/${r.id}`} className="flex justify-between gap-3 p-3 text-sm hover:bg-paper">
                <span className="font-medium">{r.name}</span><span className="text-ink-soft">{r.extra}</span>
              </Link></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
