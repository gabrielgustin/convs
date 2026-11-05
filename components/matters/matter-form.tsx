import { getMember } from "@/lib/session"
import { sql } from "@/lib/sql"
import { catalogOptions, memberOptions, type Links, type Option } from "@/lib/entities"
import { saveMatter } from "@/lib/actions/matters"
import { ActionForm } from "@/components/action-form"
import { MultiPick } from "@/components/multi-pick"

function Select({ name, label, options, value, hint }: { name: string; label: string; options: Option[]; value?: string | null; hint?: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={value ?? ""} className="input">
        <option value="">—</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

export async function MatterForm({ matter, links, clientIds }: { matter?: Record<string, any>; links?: Links; clientIds?: string[] }) {
  const { studio, user } = await getMember()
  const [fueros, estados, etapas, partes, tags, members, courts, clients] = await Promise.all([
    catalogOptions(studio.id, "fuero"), catalogOptions(studio.id, "estado"), catalogOptions(studio.id, "etapa"),
    catalogOptions(studio.id, "parte"), catalogOptions(studio.id, "etiqueta"), memberOptions(studio.id),
    sql<Option>`select id, name from courts where studio_id = ${studio.id} and (active or id = ${matter?.court_id ?? null}) order by name`,
    sql<Option>`select id, name from clients where studio_id = ${studio.id} and active order by name`,
  ])
  const id = matter?.id ?? null

  return (
    <ActionForm action={saveMatter.bind(null, id)} submit={id ? "Guardar cambios" : "Crear"} className="card max-w-3xl space-y-6 p-5">
      <fieldset className="grid gap-4 sm:grid-cols-4">
        <legend className="label mb-2">Identificación</legend>
        <div className="sm:col-span-4">
          <label className="label" htmlFor="caption">Carátula *</label>
          <input id="caption" name="caption" required maxLength={500} defaultValue={matter?.caption} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="number">Número</label>
          <input id="number" name="number" maxLength={100} defaultValue={matter?.number ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="year">Año</label>
          <input id="year" name="year" inputMode="numeric" pattern="\d{4}" maxLength={4} defaultValue={matter?.year ?? ""} className="input" />
        </div>
        <Select name="fuero_id" label="Fuero" options={fueros} value={matter?.fuero_id} />
        <div className="sm:col-span-2">
          <label className="label" htmlFor="full_number">Numeración completa</label>
          <input id="full_number" name="full_number" maxLength={200} defaultValue={matter?.full_number ?? ""} className="input" />
          <p className="mt-1 text-xs text-ink-soft">La clave única del tribunal (PJN con fuero y sala, o CUIJ). Si no la tenés, dejala vacía.</p>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="court_url">Link del tribunal</label>
          <input id="court_url" name="court_url" type="url" maxLength={1000} defaultValue={matter?.court_url ?? ""} className="input" />
          <p className="mt-1 text-xs text-ink-soft">Opcional. Si la causa ya está cargada en el estudio, te avisamos.</p>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="label mb-2">Clasificación</legend>
        <Select name="estado_id" label="Estado" options={estados} value={matter?.estado_id} hint="Si la causa se conecta a un tribunal, el estado se actualiza solo." />
        <Select name="etapa_id" label="Etapa" options={etapas} value={matter?.etapa_id} />
        <Select name="parte_id" label="Parte (cliente)" options={partes} value={matter?.parte_id} />
        <Select name="court_id" label="Radicación" options={courts} value={matter?.court_id} />
        <div className="sm:col-span-2"><MultiPick name="tags" label="Etiquetas" options={tags} defaultValue={links?.tags.map((t) => t.id)} /></div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="label mb-2">Personas</legend>
        <MultiPick name="clients" label="Clientes" options={clients} defaultValue={clientIds} />
        <MultiPick name="assignees" label="Asignados del estudio" options={members} defaultValue={links ? links.assignees.map((a) => a.id) : [user.id]} />
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Observaciones</label>
          <textarea id="notes" name="notes" rows={4} defaultValue={matter?.notes ?? ""} className="input" />
        </div>
      </fieldset>
    </ActionForm>
  )
}
