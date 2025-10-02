"use client"

import { BankCard } from "./bank-card"
import { EmptyBankState } from "./empty-bank-state"
import { BankAccountType } from "@/lib/types"
import { cn } from "@/lib/utils"

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

interface BankListProps {
  banks: BankWithAccounts[]
  filteredBanks: BankWithAccounts[]
  hasBanks: boolean
  viewMode: "grid" | "list"
  searchTerm: string
  showBalances: boolean
  formatCurrency: (amount: number) => string
  getAccountTypeLabel: (type: string) => string
  getAccountTypeColor: (type: string) => string
  onToggleFavorite: (bankId: string) => void
  onEditBank: (bank: BankWithAccounts) => void
  onAddAccount: (bank: BankWithAccounts) => void
  onDeleteBank: (bank: BankWithAccounts) => void
  onAddBank: () => void
  onClearSearch: () => void
  onShowAll: () => void
}

export function BankList({
  banks,
  filteredBanks,
  hasBanks,
  viewMode,
  searchTerm,
  showBalances,
  formatCurrency,
  getAccountTypeLabel,
  getAccountTypeColor,
  onToggleFavorite,
  onEditBank,
  onAddAccount,
  onDeleteBank,
  onAddBank,
  onClearSearch,
  onShowAll
}: BankListProps) {
  const hasFilteredResults = filteredBanks.length > 0

  if (!hasBanks || !hasFilteredResults) {
    return (
      <EmptyBankState
        hasBanks={hasBanks}
        hasFilteredResults={hasFilteredResults}
        searchTerm={searchTerm}
        onAddBank={onAddBank}
        onClearSearch={onClearSearch}
        onShowAll={onShowAll}
      />
    )
  }

  return (
    <div className={cn(
      viewMode === "grid" 
        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
        : "space-y-4"
    )}>
      {filteredBanks.map((bank) => (
        <BankCard
          key={bank.id}
          bank={bank}
          showBalances={showBalances}
          formatCurrency={formatCurrency}
          getAccountTypeLabel={getAccountTypeLabel}
          getAccountTypeColor={getAccountTypeColor}
          onToggleFavorite={onToggleFavorite}
          onEditBank={onEditBank}
          onAddAccount={onAddAccount}
          onDeleteBank={onDeleteBank}
        />
      ))}
    </div>
  )
}
