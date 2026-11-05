import Link from "next/link"
import { ContactList } from "@/components/contacts/contact-list"
import type { Params } from "@/lib/list-params"

export default async function CourtsPage({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <ContactList entity="court" params={await searchParams}
      extraActions={<Link href="/juzgados/directorio" className="btn-ghost" title="Buscá en el directorio nacional y cargá varios juzgados de una">Agregar del directorio</Link>} />
  )
}
