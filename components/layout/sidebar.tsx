"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LogOut, 
  User, 
  Settings, 
  ChevronDown,
  LayoutDashboard,
  Receipt,
  CreditCard,
  Building2,
  Calendar,
  Bot,
  TrendingUp,
  Wallet,
  PieChart
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Definindo os grupos de navegação modernos
const mainNavigation = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/", key: "dashboard" },
      { icon: TrendingUp, label: "Analytics", href: "/finances", key: "finances" },
    ]
  },
  {
    title: "Finance",
    items: [
      { icon: Receipt, label: "Transactions", href: "/transactions", key: "transactions" },
      { icon: Building2, label: "Banks", href: "/banks", key: "banks" },
      { icon: Wallet, label: "Accounts", href: "/accounts", key: "accounts" },
    ]
  },
  {
    title: "Tools",
    items: [
      { icon: Bot, label: "Automation", href: "/automation", key: "automation" },
      { icon: Calendar, label: "Calendar", href: "/calendar", key: "calendar" },
      { icon: PieChart, label: "Reports", href: "/reports", key: "reports" },
    ]
  }
]

const userNavigation = [
  { icon: User, label: "Profile", href: "/profile", key: "profile" },
  { icon: Settings, label: "Settings", href: "/settings", key: "settings" },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar className="border-r border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Header com Logo */}
      <SidebarHeader className="border-b border-border/60 p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all group-hover:scale-105">
            <div className="font-bold text-lg">A</div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Aura</span>
            <span className="text-xs text-muted-foreground">Finance Hub</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Content com navegação agrupada */}
      <SidebarContent className="px-3 py-6">
        <div className="space-y-6">
          {mainNavigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <Link href={item.href} passHref>
                        <SidebarMenuButton
                          className={cn(
                            "h-11 px-3 text-sm font-medium transition-all duration-200",
                            "hover:bg-accent/80 hover:text-accent-foreground",
                            "rounded-lg group relative",
                            isActive(item.href) && [
                              "bg-primary/10 text-primary border border-primary/20",
                              "shadow-sm shadow-primary/20"
                            ]
                          )}
                        >
                          <item.icon className={cn(
                            "h-4 w-4 transition-all duration-200",
                            isActive(item.href) 
                              ? "text-primary" 
                              : "text-muted-foreground group-hover:text-accent-foreground"
                          )} />
                          <span className="ml-3">{item.label}</span>
                          {isActive(item.href) && (
                            <div className="absolute right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>

      {/* Footer com perfil do usuário */}
      <SidebarFooter className="border-t border-border/60 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start px-3 py-6 h-auto",
                "hover:bg-accent/80 transition-all duration-200",
                "rounded-lg border border-transparent hover:border-border/60"
              )}
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 rounded-lg border border-border/60 bg-background/95 backdrop-blur"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userNavigation.map((item) => (
              <DropdownMenuItem key={item.key} asChild>
                <Link href={item.href} className="flex items-center px-3 py-2 text-sm">
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => logout()}
              className="px-3 py-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}