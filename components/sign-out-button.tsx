"use client"

import { authClient } from "@/lib/auth-client"

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => authClient.signOut().then(() => (window.location.href = "/login"))}>
      Cerrar sesión
    </button>
  )
}
