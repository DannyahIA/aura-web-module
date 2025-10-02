"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

interface NextAuthProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function NextAuthProvider({ children, session }: NextAuthProviderProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
