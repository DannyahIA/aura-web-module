"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLayout } from "@/contexts/layout-context"
import { AppSidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { SidebarProvider } from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth()
  const { pageTitle, pageSubtitle } = useLayout()

  if (!user) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <Header title={pageTitle} subtitle={pageSubtitle} />
          <main className="p-4 lg:p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}