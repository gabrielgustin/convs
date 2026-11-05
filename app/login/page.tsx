import { googleEnabled } from "@/lib/auth"
import { LoginForm } from "./login-form"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  // Solo rutas internas: evita usar el login para redirigir a otro sitio.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/inicio"
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-serif text-3xl">Estudio</h1>
        <p className="mb-6 text-center text-sm text-ink-soft">Tus causas, plazos y escritos en un solo lugar.</p>
        <LoginForm next={safeNext} google={googleEnabled} />
      </div>
    </main>
  )
}
