"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { authClient } from "@/lib/auth-client"

function ResetForm() {
  const token = useSearchParams().get("token") ?? ""
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  async function submit(form: FormData) {
    const result = await authClient.resetPassword({ token, newPassword: String(form.get("password")) })
    if (result.error) return setError(result.error.message ?? "El link venció. Pedí uno nuevo.")
    setDone(true)
  }

  if (!token) return <p className="text-sm text-danger">Link inválido. Pedí uno nuevo desde el login.</p>
  if (done) return <p className="text-sm">Listo. <a href="/login" className="text-brand underline">Entrá con tu contraseña nueva</a>.</p>
  return (
    <form action={submit} className="space-y-3">
      <label className="label" htmlFor="password">Contraseña nueva</label>
      <input id="password" name="password" type="password" minLength={8} required className="input" autoComplete="new-password" />
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button className="btn w-full">Guardar</button>
    </form>
  )
}

export default function ResetPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="card w-full max-w-sm p-6">
        <h1 className="mb-4 font-serif text-2xl">Elegí una contraseña nueva</h1>
        <Suspense><ResetForm /></Suspense>
      </div>
    </main>
  )
}
