"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Componentes modularizados
import { BankHeader } from "./bank-header"
import { BankStats } from "./bank-stats"
import { BankFilters } from "./bank-filters"
import { BankList } from "./bank-list"
import { BankDialogs } from "./bank-dialogs"
import { AccountDialog } from "./account-dialog"

// Hooks e utilidades
import { usePageConfig } from "@/hooks/use-page-config"
import { useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"
import { BankType, BankAccountType } from "@/lib/types"
import client from "@/lib/apollo-client"
import { GET_BANK_ACCOUNTS, CREATE_BANK_ACCOUNT } from "@/lib/graphql-queries"

interface BankWithAccounts extends BankType {
  accounts?: BankAccountType[]
  totalBalance?: number
  isFavorite?: boolean
}

interface AccountData {
  accountId: string
  type: string
  balance: number
  currencyCode: string
}

export function BanksPage() {
  // Estados de filtros e UI
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBalances, setShowBalances] = useState(true)
  
  // Estados de diálogos
  const [addBankOpen, setAddBankOpen] = useState(false)
  const [editBankOpen, setEditBankOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  
  // Estados de formulários
  const [bankName, setBankName] = useState("")
  const [accountData, setAccountData] = useState<AccountData>({
    accountId: "",
    type: "checking",
    balance: 0,
    currencyCode: "BRL"
  })
  
  // Estados de seleção
  const [selectedBank, setSelectedBank] = useState<BankWithAccounts | null>(null)
  const [banksWithAccounts, setBanksWithAccounts] = useState<BankWithAccounts[]>([])
  
  const { user } = useAuth()
  const { banks, loading, error, refetch, createBank, updateBank, deleteBank } = useBanks(user?.id)

  usePageConfig({
    page: "banks",
    title: "Bank Management", 
    subtitle: "Complete bank and account management system"
  })

  // Carregar contas para cada banco
  useEffect(() => {
    const loadBankAccounts = async () => {
      if (!banks || banks.length === 0) {
        setBanksWithAccounts([])
        return
      }

      try {
        const banksWithAccountsData: BankWithAccounts[] = await Promise.all(
          banks.map(async (bank) => {
            try {
              const { data } = await client.query({
                query: GET_BANK_ACCOUNTS,
                variables: { bankId: bank.id },
                fetchPolicy: 'network-only'
              })

              const accounts: BankAccountType[] = (data as any)?.bankAccounts || []
              const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
              
              return {
                ...bank,
                accounts,
                totalBalance,
                isFavorite: Math.random() > 0.7 // TODO: Implementar favoritos no backend
              }
            } catch (err) {
              console.error(`Error loading accounts for bank ${bank.id}:`, err)
              return {
                ...bank,
                accounts: [],
                totalBalance: 0,
                isFavorite: false
              }
            }
          })
        )
        
        setBanksWithAccounts(banksWithAccountsData)
      } catch (err) {
        console.error('Error loading bank accounts:', err)
      }
    }

    loadBankAccounts()
  }, [banks, user?.id])

  // Funções utilitárias
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: "Conta Corrente",
      savings: "Poupança", 
      credit: "Cartão de Crédito",
      investment: "Investimento"
    }
    return types[type] || type
  }

  const getAccountTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      checking: "bg-blue-100 text-blue-800",
      savings: "bg-green-100 text-green-800",
      credit: "bg-purple-100 text-purple-800",
      investment: "bg-orange-100 text-orange-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  // Filtros e busca
  const filteredBanks = banksWithAccounts.filter(bank => {
    const matchesSearch = bank.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    
    switch (filterBy) {
      case "favorites":
        return matchesSearch && bank.isFavorite
      case "active":
        return matchesSearch && (bank.accounts?.length || 0) > 0
      case "inactive":
        return matchesSearch && (bank.accounts?.length || 0) === 0
      default:
        return matchesSearch
    }
  })

  // Funções CRUD
  const handleCreateBank = async () => {
    if (!user?.id || !bankName.trim()) return

    try {
      await createBank({
        name: bankName.trim(),
        userId: user.id
      })
      setAddBankOpen(false)
      setBankName("")
      refetch()
    } catch (error) {
      console.error('Error creating bank:', error)
    }
  }

  const handleUpdateBank = async () => {
    if (!selectedBank || !bankName.trim()) return

    try {
      await updateBank(selectedBank.id, { name: bankName.trim() })
      setEditBankOpen(false)
      setSelectedBank(null)
      setBankName("")
      refetch()
    } catch (error) {
      console.error('Error updating bank:', error)
    }
  }

  const handleDeleteBank = async () => {
    if (!selectedBank) return

    try {
      await deleteBank(selectedBank.id)
      setDeleteConfirmOpen(false)
      setSelectedBank(null)
      refetch()
    } catch (error) {
      console.error('Error deleting bank:', error)
    }
  }

  const handleCreateAccount = async () => {
    if (!selectedBank || !user?.id || !accountData.accountId.trim()) return

    try {
      await client.mutate({
        mutation: CREATE_BANK_ACCOUNT,
        variables: { 
          input: {
            bankId: selectedBank.id,
            accountId: accountData.accountId,
            type: accountData.type,
            balance: accountData.balance,
            currencyCode: accountData.currencyCode
          }
        }
      })
      
      setAddAccountOpen(false)
      setAccountData({
        accountId: "",
        type: "checking",
        balance: 0,
        currencyCode: "BRL"
      })
      
      refetch()
    } catch (error) {
      console.error('Error creating account:', error)
    }
  }

  // Funções de manipulação de estado
  const handleToggleFavorite = (bankId: string) => {
    setBanksWithAccounts(prev => 
      prev.map(bank => 
        bank.id === bankId 
          ? { ...bank, isFavorite: !bank.isFavorite }
          : bank
      )
    )
  }

  const openEditBank = (bank: BankWithAccounts) => {
    setSelectedBank(bank)
    setBankName(bank.name || "")
    setEditBankOpen(true)
  }

  const openDeleteConfirm = (bank: BankWithAccounts) => {
    setSelectedBank(bank)
    setDeleteConfirmOpen(true)
  }

  const openAddAccount = (bank: BankWithAccounts) => {
    setSelectedBank(bank)
    setAccountData({
      accountId: "",
      type: "checking",
      balance: 0,
      currencyCode: "BRL"
    })
    setAddAccountOpen(true)
  }

  // Estados calculados
  const hasBanks = banks && banks.length > 0
  const totalBalance = banksWithAccounts.reduce((sum, bank) => sum + (bank.totalBalance || 0), 0)
  const totalAccounts = banksWithAccounts.reduce((sum, bank) => sum + (bank.accounts?.length || 0), 0)
  const favoriteCount = banksWithAccounts.filter(bank => bank.isFavorite).length

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Carregando bancos...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Erro ao carregar bancos</h3>
          <p className="text-muted-foreground mt-1">{error}</p>
        </div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <BankHeader 
          onRefresh={refetch}
          onAddBank={() => setAddBankOpen(true)}
        />

        {/* Estatísticas */}
        <BankStats
          totalBanks={hasBanks ? banksWithAccounts.length : 0}
          totalAccounts={hasBanks ? totalAccounts : 0}
          favoriteCount={hasBanks ? favoriteCount : 0}
          totalBalance={hasBanks ? totalBalance : 0}
          showBalances={showBalances}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Filtros */}
      <BankFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showBalances={showBalances}
        setShowBalances={setShowBalances}
        hasBanks={hasBanks}
      />

      {/* Lista de bancos */}
      <BankList
        banks={banksWithAccounts}
        filteredBanks={filteredBanks}
        hasBanks={hasBanks}
        viewMode={viewMode}
        searchTerm={searchTerm}
        showBalances={showBalances}
        formatCurrency={formatCurrency}
        getAccountTypeLabel={getAccountTypeLabel}
        getAccountTypeColor={getAccountTypeColor}
        onToggleFavorite={handleToggleFavorite}
        onEditBank={openEditBank}
        onAddAccount={openAddAccount}
        onDeleteBank={openDeleteConfirm}
        onAddBank={() => setAddBankOpen(true)}
        onClearSearch={() => setSearchTerm("")}
        onShowAll={() => setFilterBy("all")}
      />

      {/* Diálogos */}
      <BankDialogs
        addBankOpen={addBankOpen}
        setAddBankOpen={setAddBankOpen}
        bankName={bankName}
        setBankName={setBankName}
        onCreateBank={handleCreateBank}
        editBankOpen={editBankOpen}
        setEditBankOpen={setEditBankOpen}
        onUpdateBank={handleUpdateBank}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        selectedBankName={selectedBank?.name}
        onDeleteBank={handleDeleteBank}
      />

      <AccountDialog
        open={addAccountOpen}
        setOpen={setAddAccountOpen}
        selectedBankName={selectedBank?.name}
        accountData={accountData}
        setAccountData={setAccountData}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  )
}
