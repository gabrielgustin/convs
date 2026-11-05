import Link from "next/link"
import { MatterForm } from "@/components/matters/matter-form"

export default function NewMatterPage() {
  return (
    <div className="space-y-4">
      <Link href="/expedientes" className="text-sm text-ink-soft hover:underline">← Expedientes</Link>
      <h1 className="font-serif text-3xl">Nuevo expediente</h1>
      <MatterForm />
    </div>
  )
}
