"use client"

import { useId, useState } from "react"
import { X } from "lucide-react"

type Option = { id: string; name: string; color?: string }

/** Selector múltiple con búsqueda. Envía cada elección como un campo `name` repetido. */
export function MultiPick({ name, label, options, defaultValue = [], placeholder = "Agregar…" }: {
  name: string
  label: string
  options: Option[]
  defaultValue?: string[]
  placeholder?: string
}) {
  const [selected, setSelected] = useState<string[]>(defaultValue)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const id = useId()
  const byId = new Map(options.map((o) => [o.id, o]))
  const matches = options.filter((o) => !selected.includes(o.id) && o.name.toLowerCase().includes(query.toLowerCase())).slice(0, 30)
  const add = (optionId: string) => { setSelected((s) => [...s, optionId]); setQuery("") }

  return (
    <div className="relative">
      <label className="label" htmlFor={id}>{label}</label>
      <div className="flex flex-wrap gap-1 rounded-md border border-line bg-white p-1.5 focus-within:border-brand">
        {selected.map((sid) => byId.get(sid) && (
          <span key={sid} className="inline-flex items-center gap-1 rounded bg-paper px-2 py-0.5 text-sm">
            {byId.get(sid)!.color && <span className="h-2 w-2 rounded-full" style={{ background: byId.get(sid)!.color }} />}
            {byId.get(sid)!.name}
            <button type="button" aria-label={`Quitar ${byId.get(sid)!.name}`} onClick={() => setSelected((s) => s.filter((x) => x !== sid))}><X size={12} /></button>
            <input type="hidden" name={name} value={sid} />
          </span>
        ))}
        <input id={id} value={query} placeholder={placeholder} autoComplete="off" role="combobox" aria-expanded={open} aria-controls={`${id}-list`}
          className="min-w-24 flex-1 px-1 text-sm outline-none"
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (matches[0]) add(matches[0].id) } }} />
      </div>
      {open && matches.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-line bg-white shadow">
          {matches.map((o) => (
            <li key={o.id} role="option" aria-selected={false} className="cursor-pointer px-3 py-1.5 text-sm hover:bg-paper" onMouseDown={(e) => { e.preventDefault(); add(o.id) }}>
              {o.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
