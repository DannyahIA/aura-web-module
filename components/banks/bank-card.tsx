"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Building2, Star, StarOff, MoreHorizontal, Edit3, Plus, Trash2 } from "lucide-react"
import { BankAccountType } from "@/lib/types"

interface BankWithAccounts {
  id: string
  name?: string
  accounts?: BankAccountType[]
  totalBalance?: number
  isFavorite?: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

interface BankCardProps {
  bank: BankWithAccounts
  showBalances: boolean
  formatCurrency: (amount: number) => string
  getAccountTypeLabel: (type: string) => string
  getAccountTypeColor: (type: string) => string
  onToggleFavorite: (bankId: string) => void
  onEditBank: (bank: BankWithAccounts) => void
  onAddAccount: (bank: BankWithAccounts) => void
  onDeleteBank: (bank: BankWithAccounts) => void
}

export function BankCard({
  bank,
  showBalances,
  formatCurrency,
  getAccountTypeLabel,
  getAccountTypeColor,
  onToggleFavorite,
  onEditBank,
  onAddAccount,
  onDeleteBank
}: BankCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{bank.name}</CardTitle>
              <CardDescription>
                {bank.accounts?.length || 0} conta{(bank.accounts?.length || 0) !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(bank.id)}
            >
              {bank.isFavorite ? (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditBank(bank)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddAccount(bank)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDeleteBank(bank)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Resumo do saldo */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Saldo Total</span>
            <span className="font-bold text-lg">
              {showBalances ? formatCurrency(bank.totalBalance || 0) : "••••••"}
            </span>
          </div>
        </div>

        {/* Lista de contas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Contas</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddAccount(bank)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {bank.accounts && bank.accounts.length > 0 ? (
            <div className="space-y-2">
              {bank.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={getAccountTypeColor(account.type || "")}>
                      {getAccountTypeLabel(account.type || "")}
                    </Badge>
                    <span className="text-xs font-mono">{account.accountId}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {showBalances ? formatCurrency(account.balance || 0) : "••••"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhuma conta cadastrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
