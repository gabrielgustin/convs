"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"

type Mode = "entrar" | "crear" | "link" | "olvide"

export function LoginForm({ next, google }: { next: string; google: boolean }) {
  const [mode, setMode] = useState<Mode>("entrar")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  async function submit(form: FormData) {
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const name = String(form.get("name") ?? "").trim()
    setBusy(true)
    setError("")
    setNotice("")
    const result =
      mode === "entrar" ? await authClient.signIn.email({ email, password, callbackURL: next })
      : mode === "crear" ? await authClient.signUp.email({ email, password, name: name || email.split("@")[0], callbackURL: next })
      : mode === "link" ? await authClient.signIn.magicLink({ email, callbackURL: next })
      : await authClient.requestPasswordReset({ email, redirectTo: "/restablecer" })
    setBusy(false)
    if (result.error) return setError(result.error.message ?? "No se pudo completar.")
    if (mode === "link") return setNotice("Te mandamos un link a tu email. Abrilo desde este dispositivo.")
    if (mode === "olvide") return setNotice("Si el email tiene cuenta, te llega un link para elegir otra contraseña.")
    window.location.href = next
  }

  const tab = (id: Mode, label: string) => (
    <button type="button" onClick={() => { setMode(id); setError(""); setNotice("") }}
      className={`flex-1 border-b-2 pb-2 text-sm ${mode === id ? "border-brand font-medium" : "border-transparent text-ink-soft"}`}>
      {label}
    </button>
  )

  return (
    <div className="card p-6">
      <div className="mb-5 flex">{tab("entrar", "Entrar")}{tab("crear", "Crear cuenta")}</div>

      {google && (
        <>
          <button type="button" className="btn-ghost w-full" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: next })}>
            Continuar con Google
          </button>
          <div className="my-4 text-center text-xs text-ink-soft">o con tu email</div>
        </>
      )}

      <form action={submit} className="space-y-3">
        {mode === "crear" && (
          <div><label className="label" htmlFor="name">Nombre y apellido</label><input id="name" name="name" className="input" autoComplete="name" /></div>
        )}
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
        {(mode === "entrar" || mode === "crear") && (
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required minLength={8} className="input"
              autoComplete={mode === "crear" ? "new-password" : "current-password"} />
          </div>
        )}
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        {notice && <p role="status" className="text-sm text-ok">{notice}</p>}
        <button className="btn w-full" disabled={busy}>
          {mode === "entrar" ? "Entrar" : mode === "crear" ? "Crear cuenta" : mode === "link" ? "Mandarme el link" : "Mandarme el link"}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-1 text-center text-sm">
        {mode !== "link" && <button type="button" className="text-brand hover:underline" onClick={() => setMode("link")}>Entrar con un link por email, sin contraseña</button>}
        {mode !== "olvide" && <button type="button" className="text-ink-soft hover:underline" onClick={() => setMode("olvide")}>¿Olvidaste tu contraseña?</button>}
        {(mode === "link" || mode === "olvide") && <button type="button" className="text-ink-soft hover:underline" onClick={() => setMode("entrar")}>Volver</button>}
      </div>
    </div>
  )
}
