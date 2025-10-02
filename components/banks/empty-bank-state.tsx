"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Plus, Search } from "lucide-react"

interface EmptyBankStateProps {
  hasBanks: boolean
  hasFilteredResults: boolean
  searchTerm: string
  onAddBank: () => void
  onClearSearch: () => void
  onShowAll: () => void
}

export function EmptyBankState({ 
  hasBanks, 
  hasFilteredResults, 
  searchTerm, 
  onAddBank, 
  onClearSearch, 
  onShowAll 
}: EmptyBankStateProps) {
  if (hasBanks && hasFilteredResults) return null

  if (!hasBanks) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-blue-100 rounded-full mb-6">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum banco cadastrado</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Comece adicionando seu primeiro banco para gerenciar suas contas e transações de forma organizada.
          </p>
          <Button onClick={onAddBank} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeiro Banco
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum banco encontrado</h3>
        <p className="text-muted-foreground text-center mb-4">
          {searchTerm 
            ? `Nenhum banco corresponde à busca "${searchTerm}". Tente ajustar os filtros.`
            : "Nenhum banco corresponde aos filtros selecionados."
          }
        </p>
        <div className="flex gap-2">
          {searchTerm && (
            <Button variant="outline" onClick={onClearSearch}>
              Limpar busca
            </Button>
          )}
          <Button variant="outline" onClick={onShowAll}>
            Mostrar todos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
