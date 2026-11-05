'use client'

import React, { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authClient, useSession } from '@/lib/auth-client'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: (redirectUrl?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password })
    return !result.error
  }

  const logout = async (redirectUrl?: string) => {
    await authClient.signOut()
    if (redirectUrl) router.push(redirectUrl)
    router.refresh()
  }

  return <AuthContext.Provider value={{ isAuthenticated: Boolean(session?.user), login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe ser usado dentro de AuthProvider')
  return context
}
