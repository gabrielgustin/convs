import Link from "next/link"
import { PAGE_SIZE, withParams, type Params } from "@/lib/list-params"

export function Pager({ path, params, page, total }: { path: string; params: Params; page: number; total: number }) {
  const pages = Math.ceil(total / PAGE_SIZE)
  if (pages <= 1) return null
  const href = (p: number) => withParams(path, params, { page: String(p) })
  return (
    <nav aria-label="Páginas" className="mt-4 flex items-center justify-center gap-3 text-sm">
      {page > 1 ? <Link className="btn-ghost" href={href(page - 1)}>Anterior</Link> : <span />}
      <span>Página {page} de {pages}</span>
      {page < pages ? <Link className="btn-ghost" href={href(page + 1)}>Siguiente</Link> : <span />}
    </nav>
  )
}
