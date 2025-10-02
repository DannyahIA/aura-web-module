"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/auth/login-page"
import { GoogleAccountStatus } from "@/components/auth/google-account-status"

export default function CalendarPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
        <p className="text-muted-foreground">
          Veja e gerencie seus eventos do calendário
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <GoogleAccountStatus />
        {/* Outros cartões de calendário podem ser adicionados aqui */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Funcionalidades em breve</h3>
          <p className="text-sm text-muted-foreground">
            Mais opções do calendário serão adicionadas em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
