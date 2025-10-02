"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Filter, Search } from "lucide-react"

interface BankFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterBy: "all" | "favorites" | "active" | "inactive"
  setFilterBy: (filter: "all" | "favorites" | "active" | "inactive") => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  showBalances: boolean
  setShowBalances: (show: boolean) => void
  hasBanks: boolean
}

export function BankFilters({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  viewMode,
  setViewMode,
  showBalances,
  setShowBalances,
  hasBanks
}: BankFiltersProps) {
  if (!hasBanks) return null

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bancos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
        
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="favorites">Favoritos</SelectItem>
            <SelectItem value="active">Com Contas</SelectItem>
            <SelectItem value="inactive">Sem Contas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBalances(!showBalances)}
        >
          {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
        
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grade</SelectItem>
            <SelectItem value="list">Lista</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
