import Link from "next/link"
import { ContactForm } from "@/components/contacts/contact-form"

export default function NewPage() {
  return (
    <div className="space-y-4">
      <Link href="/clientes" className="text-sm text-ink-soft hover:underline">← Volver</Link>
      <h1 className="font-serif text-3xl">Nuevo cliente</h1>
      <ContactForm entity="client" />
    </div>
  )
}
