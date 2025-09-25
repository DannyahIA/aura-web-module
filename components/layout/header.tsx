"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/layout/user-nav"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 p-3 backdrop-blur-lg lg:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h2 className="text-2xl font-black font-montserrat text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <UserNav />
      </div>
    </header>
  )
}