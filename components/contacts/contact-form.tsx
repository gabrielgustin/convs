import { getMember } from "@/lib/session"
import { CONTACTS, PROVINCES, type ContactEntity } from "@/lib/contacts"
import { catalogOptions, memberOptions, type Links } from "@/lib/entities"
import { saveContact } from "@/lib/actions/contacts"
import { ActionForm } from "@/components/action-form"
import { MultiPick } from "@/components/multi-pick"

/** Formulario de alta/edición de cliente o juzgado. */
export async function ContactForm({ entity, record, links }: { entity: ContactEntity; record?: Record<string, any>; links?: Links }) {
  const { studio, user } = await getMember()
  const config = CONTACTS[entity]
  const [types, members, tags] = await Promise.all([
    catalogOptions(studio.id, config.typeKind), memberOptions(studio.id), catalogOptions(studio.id, "etiqueta"),
  ])
  const id = record?.id ?? null

  return (
    <ActionForm action={saveContact.bind(null, entity, id)} submit={id ? "Guardar cambios" : `Crear ${config.singular}`} className="card max-w-3xl space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Nombre *</label>
          <input id="name" name="name" required maxLength={200} defaultValue={record?.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="type_id">Tipo</label>
          <select id="type_id" name="type_id" defaultValue={record?.type_id ?? ""} className="input">
            <option value="">—</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="active">Estado</label>
          <select id="active" name="active" defaultValue={record?.active === false ? "0" : "1"} className="input">
            <option value="1">Activo</option><option value="0">Inactivo</option>
          </select>
        </div>
        {config.fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="label" htmlFor={f.key}>{f.label}</label>
            {f.type === "textarea"
              ? <textarea id={f.key} name={f.key} rows={3} defaultValue={record?.[f.key] ?? ""} className="input" />
              : f.key === "province"
                ? (
                  <select id={f.key} name={f.key} defaultValue={record?.[f.key] ?? ""} className="input">
                    <option value="">—</option>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                )
                : <input id={f.key} name={f.key} type={f.type ?? "text"} defaultValue={record?.[f.key] ?? ""} className="input" />}
          </div>
        ))}
        <MultiPick name="assignees" label="Asignados" options={members} defaultValue={links ? links.assignees.map((a) => a.id) : [user.id]} />
        <MultiPick name="tags" label="Etiquetas" options={tags} defaultValue={links?.tags.map((t) => t.id)} />
      </div>
    </ActionForm>
  )
}
