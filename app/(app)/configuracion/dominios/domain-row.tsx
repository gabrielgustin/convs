"use client"

import { useState, useTransition } from "react"
import { removeDomain, verifyDomain } from "../actions"

export function DomainRow({ domain, canEdit }: { domain: { id: string; domain: string; token: string; verified: boolean }; canEdit: boolean }) {
  const [message, setMessage] = useState<{ error?: string; ok?: string }>()
  const [pending, start] = useTransition()
  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-medium">{domain.domain}</div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${domain.verified ? "bg-ok/10 text-ok" : "bg-amber-100 text-amber-800"}`}>
          {domain.verified ? "Verificado" : "Sin verificar"}
        </span>
      </div>
      {!domain.verified && (
        <p className="mt-2 text-sm text-ink-soft">
          Agregá en el DNS un registro <b>TXT</b> en <code>{domain.domain}</code> con el valor <code className="break-all rounded bg-paper px-1">{domain.token}</code>
        </p>
      )}
      {canEdit && (
        <div className="mt-3 flex items-center gap-2">
          {!domain.verified && (
            <button className="btn" disabled={pending} onClick={() => start(async () => setMessage(await verifyDomain(domain.id)))}>Verificar</button>
          )}
          <button className="btn-ghost" disabled={pending} onClick={() => confirm(`¿Quitar ${domain.domain}?`) && start(() => removeDomain(domain.id))}>Quitar</button>
          {message?.error && <span role="alert" className="text-sm text-danger">{message.error}</span>}
          {message?.ok && <span role="status" className="text-sm text-ok">{message.ok}</span>}
        </div>
      )}
    </div>
  )
}
