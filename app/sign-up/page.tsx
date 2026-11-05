'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const result = await authClient.signUp.email(form)
    if (result.error) setError('No se pudo crear la cuenta. Verifica los datos.')
    else { router.push('/cursos/admin'); router.refresh() }
  }

  return <main className="min-h-screen flex items-center justify-center bg-background p-6"><form onSubmit={submit} className="w-full max-w-md rounded-lg border border-border bg-card p-8 flex flex-col gap-4"><h1 className="font-serif text-3xl">Crear acceso administrador</h1><p className="text-sm text-muted-foreground">Usa este acceso para administrar cursos y publicaciones.</p><Input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input required type="email" placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input required minLength={8} type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{error && <p className="text-sm text-destructive">{error}</p>}<Button type="submit">Crear cuenta</Button></form></main>
}
