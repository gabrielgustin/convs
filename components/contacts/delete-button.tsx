"use client"

import { useState, useTransition } from "react"
import type { ContactEntity } from "@/lib/contacts"
import { deleteContact } from "@/lib/actions/contacts"

export function DeleteContactButton({ entity, id }: { entity: ContactEntity; id: string }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState("")
  return (
    <div className="text-right">
      <button className="btn-ghost text-danger" disabled={pending}
        onClick={() => confirm("¿Borrar definitivamente?") && start(async () => setError((await deleteContact(entity, id))?.error ?? ""))}>
        Borrar
      </button>
      {error && <p role="alert" className="mt-1 max-w-xs text-sm text-danger">{error}</p>}
    </div>
  )
}
