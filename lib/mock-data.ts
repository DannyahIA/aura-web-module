import {
  LayoutDashboard,
  CreditCard,
  Building2,
  Calendar,
  Home,
  User,
  Settings,
  Receipt,
} from "lucide-react"

export const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", key: "dashboard" },
  { icon: Receipt, label: "Transactions", href: "/transactions", key: "transactions" },
  { icon: CreditCard, label: "Finances", href: "/finances", key: "finances" },
  { icon: Building2, label: "Banks", href: "/banks", key: "banks" },
  { icon: Calendar, label: "Calendar", href: "/calendar", key: "calendar" },
  { icon: Home, label: "Automation", href: "/automation", key: "automation" },
]

export const userNavigationItems = [
  { icon: User, label: "Profile", href: "/profile", key: "profile" },
  { icon: Settings, label: "Settings", href: "/settings", key: "settings" },
]

// Mock user
export const mockUser = {
  id: "1",
  name: "Demo User",
  email: "demo@aurahub.com",
  phone: "+55 11 99999-9999",
  avatar: "/diverse-user-avatars.png",
}