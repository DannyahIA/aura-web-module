"use client"

import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"

interface BankHeaderProps {
  onRefresh: () => void
  onAddBank: () => void
}

export function BankHeader({ onRefresh, onAddBank }: BankHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bancos</h1>
        <p className="text-muted-foreground">
          Gerencie todas suas contas bancárias em um só lugar
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <Button onClick={onAddBank}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Banco
        </Button>
      </div>
    </div>
  )
}
