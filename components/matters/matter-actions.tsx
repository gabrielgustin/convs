"use client"

import { useState, useTransition } from "react"
import { deleteActivity, purgeMatter, restoreMatter, setArchived, trashMatter } from "@/lib/actions/matters"

export function MatterActions({ id, archived, trashed }: { id: string; archived: boolean; trashed: boolean }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState("")
  const run = (fn: () => Promise<{ error?: string } | void | undefined>) =>
    start(async () => {
      setError("")
      try { setError((await fn())?.error ?? "") } catch (e) { setError(e instanceof Error ? e.message : "No se pudo completar.") }
    })

  return (
    <div className="text-right">
      <div className="flex flex-wrap justify-end gap-2">
        {trashed ? (
          <>
            <button className="btn-ghost" disabled={pending} onClick={() => run(() => restoreMatter(id))}>Restaurar</button>
            <button className="btn-ghost text-danger" disabled={pending}
              onClick={() => confirm("Se borra para siempre, con sus actuaciones. ¿Seguir?") && run(() => purgeMatter(id))}>Borrar definitivamente</button>
          </>
        ) : (
          <>
            <button className="btn-ghost" disabled={pending} onClick={() => run(() => setArchived(id, !archived))}>{archived ? "Desarchivar" : "Archivar"}</button>
            <button className="btn-ghost text-danger" disabled={pending} onClick={() => run(() => trashMatter(id))}>Mandar a la papelera</button>
          </>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}

export function DeleteActivityButton({ matterId, activityId }: { matterId: string; activityId: string }) {
  const [pending, start] = useTransition()
  return (
    <button className="text-xs text-ink-soft hover:text-danger" disabled={pending} aria-label="Borrar actuación"
      onClick={() => confirm("¿Borrar esta actuación?") && start(() => deleteActivity(matterId, activityId))}>Borrar</button>
  )
}
