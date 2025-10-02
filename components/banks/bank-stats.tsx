"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, CreditCard, Star, Wallet } from "lucide-react"

interface BankStatsProps {
  totalBanks: number
  totalAccounts: number
  favoriteCount: number
  totalBalance: number
  showBalances: boolean
  formatCurrency: (amount: number) => string
}

export function BankStats({ 
  totalBanks, 
  totalAccounts, 
  favoriteCount, 
  totalBalance, 
  showBalances, 
  formatCurrency 
}: BankStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Bancos</p>
              <p className="text-2xl font-bold">{totalBanks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Contas</p>
              <p className="text-2xl font-bold">{totalAccounts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Favoritos</p>
              <p className="text-2xl font-bold">{favoriteCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Total</p>
              <p className="text-2xl font-bold">
                {showBalances ? formatCurrency(totalBalance) : "••••••"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
