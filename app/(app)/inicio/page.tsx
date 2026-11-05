import Link from "next/link"
import { getMember } from "@/lib/session"

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("es-AR", { hour: "numeric", hourCycle: "h23", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date()))
  return hour < 12 ? "Buen día" : hour < 20 ? "Buenas tardes" : "Buenas noches"
}

export default async function InicioPage() {
  const { user, role } = await getMember()
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">{greeting()}, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-ink-soft">El panel con causas, agenda y vencimientos llega con las próximas fases.</p>
      {role === "admin" && (
        <div className="card mt-6 p-5">
          <h2 className="font-medium">Primeros pasos</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-ink-soft">
            <li><Link className="text-brand underline" href="/configuracion/estudio">Poné el nombre y el logo del estudio</Link></li>
            <li><Link className="text-brand underline" href="/configuracion/usuarios">Invitá a tu equipo</Link></li>
            <li><Link className="text-brand underline" href="/configuracion/estados">Revisá los catálogos</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}
