"use client"

import { useActionState } from "react"
import type { ActionResult } from "@/app/(app)/configuracion/actions"

/** Formulario que llama a una server action y muestra su resultado (error u ok) debajo. */
export function ActionForm({ action, children, submit, className, danger }: {
  action: (state: ActionResult, form: FormData) => Promise<ActionResult>
  children: React.ReactNode
  submit: string
  className?: string
  danger?: boolean
}) {
  const [state, run, pending] = useActionState(action, undefined)
  return (
    <form action={run} className={className}>
      {children}
      <div className="flex items-center gap-3">
        <button className={danger ? "btn bg-danger hover:bg-danger/90" : "btn"} disabled={pending}>{pending ? "Guardando…" : submit}</button>
        {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
        {state?.ok && <p role="status" className="text-sm text-ok">{state.ok}</p>}
      </div>
    </form>
  )
}
