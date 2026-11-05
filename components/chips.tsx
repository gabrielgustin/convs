type Option = { id: string; name: string; color?: string }

export function Chip({ name, color }: { name: string; color?: string | null }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2 py-0.5 text-xs whitespace-nowrap">
      {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {name}
    </span>
  )
}

export function Chips({ items }: { items: Option[] }) {
  if (!items.length) return <span className="text-ink-soft">—</span>
  return <span className="flex flex-wrap gap-1">{items.map((i) => <Chip key={i.id} name={i.name} color={i.color} />)}</span>
}

export const names = (items: Option[]) => (items.length ? items.map((i) => i.name).join(", ") : "—")
