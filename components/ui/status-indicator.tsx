"use client"

import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  variant?: "success" | "warning" | "error" | "info" | "default"
  size?: "sm" | "md" | "lg"
  className?: string
  animate?: boolean
}

export function StatusIndicator({ 
  variant = "default", 
  size = "md", 
  className,
  animate = false
}: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        "rounded-full",
        // Size variants
        {
          "h-1.5 w-1.5": size === "sm",
          "h-2 w-2": size === "md",
          "h-3 w-3": size === "lg",
        },
        // Color variants
        {
          "bg-muted-foreground": variant === "default",
          "bg-emerald-500": variant === "success",
          "bg-amber-500": variant === "warning",
          "bg-red-500": variant === "error",
          "bg-blue-500": variant === "info",
        },
        // Animation
        animate && "animate-pulse",
        className
      )}
    />
  )
}
