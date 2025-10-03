"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Settings, User, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function UserNav() {
    const { user, logout } = useAuth()

    if (!user) {
        return null
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
        <div className="flex items-center gap-3">
            {/* Search Button */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>

            {/* Quick Actions */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Quick add</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                    3
                </Badge>
            </div>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="relative h-9 w-9 rounded-full p-0 hover:bg-accent/80"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || ""} alt={user.name || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                {getUserInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="w-64 rounded-lg border border-border/60 bg-background/95 backdrop-blur" 
                    align="end" 
                    forceMount
                >
                    <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || ""} alt={user.name || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {getUserInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs text-muted-foreground">Online</span>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2 space-y-1">
                        <Link href="/profile" passHref>
                            <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2">
                                <User className="mr-3 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/settings" passHref>
                            <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2">
                                <Settings className="mr-3 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </Link>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                        <DropdownMenuItem 
                            onClick={logout}
                            className="cursor-pointer rounded-md px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}