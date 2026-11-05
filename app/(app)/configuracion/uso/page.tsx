import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { planOf } from "@/lib/plans"

function Meter({ label, used, total, unit, hint }: { label: string; used: number; total: number; unit?: string; hint?: string }) {
  const pct = Math.min(100, Math.round((used / total) * 100))
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className="text-2xl font-medium">{used.toLocaleString("es-AR")}<span className="text-sm text-ink-soft"> / {total.toLocaleString("es-AR")}{unit}</span></div>
      <div className="mt-2 h-1.5 rounded bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded bg-brand" style={{ width: `${pct}%` }} />
      </div>
      {hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

export default async function UsagePage() {
  const { studio } = await getMember()
  const plan = planOf(studio.plan)
  const [{ users, matters }] = await sql<{ users: string; matters: string }>`
    select (select count(*) from members where studio_id = ${studio.id} and active) as users,
           (select count(*) from matters where studio_id = ${studio.id} and not archived and deleted_at is null) as matters`
  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-medium">Plan y uso · {plan.label}</h2>
      <p className="mb-4 text-sm text-ink-soft">Cuánto usa el estudio de lo que incluye su plan.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Meter label="Usuarios activos" used={Number(users)} total={plan.users} />
        {/* Las fases 4 y 6 completan los contadores de archivos. */}
        <Meter label="Expedientes activos" used={Number(matters)} total={plan.expedientes} hint="Los archivados y los de la papelera no cuentan." />
        <Meter label="Almacenamiento" used={0} total={plan.storageMb} unit=" MB" />
        <Meter label="Archivos de tribunales" used={0} total={plan.courtFilesMb} unit=" MB" hint="Lo que se baja solo de los tribunales tiene su propio límite." />
      </div>
    </div>
  )
}
