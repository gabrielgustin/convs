import { notFound } from "next/navigation"
import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { CATALOGS, TASK_CATEGORIES, kindFromSlug } from "@/lib/catalogs"
import { CatalogList, type Item } from "./catalog-list"

export default async function CatalogPage({ params }: { params: Promise<{ catalogo: string }> }) {
  const kind = kindFromSlug((await params).catalogo)
  if (!kind) notFound()
  const { studio, role } = await getMember()
  const items = await sql<Item>`
    select id, name, color, active, category from catalog_items where studio_id = ${studio.id} and kind = ${kind} order by sort, name`
  const meta = CATALOGS[kind]
  const canEdit = role === "admin"

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-medium">{meta.label}</h2>
        <p className="text-sm text-ink-soft">{meta.hint}</p>
      </div>
      {kind === "estado_tarea"
        ? TASK_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-medium">{cat.label}</h3>
              <p className="mb-2 text-xs text-ink-soft">{cat.hint}</p>
              <CatalogList kind={kind} category={cat.id} items={items.filter((i) => i.category === cat.id)} canEdit={canEdit} />
            </div>
          ))
        : <CatalogList kind={kind} items={items} canEdit={canEdit} />}
      {kind === "estado" && (
        <p className="text-sm text-ink-soft">Los estados que informa cada tribunal (PJN, SCBA, EJE, SRT) se suman acá cuando conectes los tribunales: vas a poder cambiarles el nombre y el color, pero no borrarlos.</p>
      )}
    </div>
  )
}
