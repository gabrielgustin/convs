"use server"

import { revalidatePath } from "next/cache"
import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { formIds } from "@/lib/entities"
import type { ActionResult } from "@/app/(app)/configuracion/actions"

export async function importFromDirectory(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { studio } = await getMember()
  const ids = formIds(form, "ids").slice(0, 200)
  if (!ids.length) return { error: "Elegí al menos un juzgado." }
  const rows = await sql`
    insert into courts (studio_id, name, province, email, phone, identification, address)
    select ${studio.id}, d.name, d.province, d.email, d.phone, d.identification, d.address
    from court_directory d
    where d.id = any(${ids}::uuid[])
      and not exists (select 1 from courts c where c.studio_id = ${studio.id} and lower(c.name) = lower(d.name))
    returning id`
  revalidatePath("/juzgados")
  revalidatePath("/juzgados/directorio")
  return { ok: `Se agregaron ${rows.length} juzgado(s).` }
}
