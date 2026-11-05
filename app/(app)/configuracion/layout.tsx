import Link from "next/link"
import { CATALOGS } from "@/lib/catalogs"

const groups: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Estudio",
    links: [
      { href: "/configuracion/estudio", label: "Datos del estudio" },
      { href: "/configuracion/uso", label: "Plan y uso" },
      { href: "/configuracion/dominios", label: "Dominios" },
      { href: "/configuracion/usuarios", label: "Usuarios" },
    ],
  },
]
for (const catalog of Object.values(CATALOGS)) {
  const group = groups.find((g) => g.title === catalog.group) ?? groups[groups.push({ title: catalog.group, links: [] }) - 1]
  group.links.push({ href: `/configuracion/${catalog.slug}`, label: catalog.label })
}

export default function ConfigLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-serif text-3xl">Configuración</h1>
      <p className="mb-6 text-sm text-ink-soft">Administrá el estudio y sus catálogos.</p>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="shrink-0 md:w-52">
          {groups.map((group) => (
            <div key={group.title} className="mb-4">
              <div className="label">{group.title}</div>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="block rounded px-2 py-1 text-sm hover:bg-brand-soft">{link.label}</Link>
              ))}
            </div>
          ))}
        </nav>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  )
}
