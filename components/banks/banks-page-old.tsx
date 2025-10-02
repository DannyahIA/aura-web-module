"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FirstBankSetup } from "@/components/banks/first-bank-setup"
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Star,
  StarOff
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { usePageConfig } from "@/hooks/use-page-config"
import { useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"
import { BankType, BankAccountType, CreateBankAccountInput } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BankWithAccounts extends BankType {
  accounts?: BankAccountType[]
  totalBalance?: number
  isFavorite?: boolean
}

export function BanksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBalances, setShowBalances] = useState(true)
  
  // Dialogs state
  const [addBankOpen, setAddBankOpen] = useState(false)
  const [editBankOpen, setEditBankOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [editAccountOpen, setEditAccountOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  
  // Selected items
  const [selectedBank, setSelectedBank] = useState<BankWithAccounts | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<BankAccountType | null>(null)
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
              // Simular carregamento de contas (substituir pela query real)
              const mockAccounts: BankAccountType[] = [
                {
                  id: `acc_${bank.id}_1`,
                  bankId: bank.id,
                  accountId: "0001-123456",
                  type: "checking",
                  balance: Math.random() * 10000,
                  currencyCode: "BRL",
                  userId: user?.id || "",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                },
                {
                  id: `acc_${bank.id}_2`, 
                  bankId: bank.id,
                  accountId: "0002-789012",
                  type: "savings",
                  balance: Math.random() * 5000,
                  currencyCode: "BRL",
                  userId: user?.id || "",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ]

              const totalBalance = mockAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
              
              return {
                ...bank,
                accounts: mockAccounts,
                totalBalance,
                isFavorite: Math.random() > 0.7 // Random favorites
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
  }, [banks])

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

  if (error) {
    return (
      <EmptyBanks
        onAddBank={() => setAddBankOpen(true)}
        onRetry={refetch}
        isError={true}
        errorMessage={error}
      />
    )
  }

  if (!banks || banks.length === 0) {
    return (
      <EmptyBanks
        onAddBank={() => setAddBankOpen(true)}
        onRetry={refetch}
        isError={false}
      />
    )
  }

  const handleUpdateBank = async (id: string, name: string) => {
    try {
      await updateBank(id, { name })
    } catch (error) {
      console.error('Error updating bank:', error)
    }
  }

  const handleDeleteBank = async (id: string) => {
    try {
      await deleteBank(id)
    } catch (error) {
      console.error('Error deleting bank:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando bancos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <span className="text-red-500 mb-4">Erro ao carregar bancos: {error}</span>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancos</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias conectadas
          </p>
        </div>
        <Button onClick={() => setAddBankOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Banco
        </Button>
      </div>

      {banks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum banco conectado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Conecte suas contas bancárias para começar a gerenciar suas finanças
            </p>
            <Button onClick={() => setAddBankOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar seu primeiro banco
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank: BankType) => (
            <Card key={bank.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {bank.name || 'Banco sem nome'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteBank(bank.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{bank.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span>{new Date(bank.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedBankId(bank.id)
                        setAddAccountOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddBankDialog
        open={addBankOpen}
        onOpenChange={setAddBankOpen}
        onBankAdded={handleCreateBank}
      />

      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        bankId={selectedBankId}
        onAccountAdded={() => {
          setAddAccountOpen(false)
          refetch()
        }}
      />
    </div>
  )
}
