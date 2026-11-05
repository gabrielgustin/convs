import { SignOutButton } from "@/components/sign-out-button"

export default function NoAccessPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="card max-w-sm p-6 text-center">
        <h1 className="mb-2 font-serif text-2xl">Sin acceso</h1>
        <p className="mb-4 text-sm text-ink-soft">Tu usuario está desactivado o el estudio fue dado de baja. Pedile acceso a un administrador.</p>
        <SignOutButton className="btn-ghost" />
      </div>
    </main>
  )
}
