import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Database, Plus, RefreshCw } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  onRetry?: () => void
  showRetry?: boolean
  isError?: boolean
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  onRetry,
  showRetry = false,
  isError = false
}: EmptyStateProps) {
  const defaultIcon = isError ? (
    <AlertCircle className="h-16 w-16 text-red-500" />
  ) : (
    <Database className="h-16 w-16 text-muted-foreground" />
  )

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="mb-6">
          {icon || defaultIcon}
        </div>
        
        <h3 className={`text-xl font-semibold mb-2 ${
          isError ? 'text-red-600' : 'text-muted-foreground'
        }`}>
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        
        <div className="flex gap-3">
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          )}
          
          {actionLabel && onAction && (
            <Button 
              onClick={onAction}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
