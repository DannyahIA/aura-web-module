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
  StarOff,
  Settings,
  Copy,
  ExternalLink
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { usePageConfig } from "@/hooks/use-page-config"
import { useBanks, useBankAccounts } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"
import { BankType, BankAccountType, CreateBankAccountInput } from "@/lib/types"
import { cn } from "@/lib/utils"
import client from "@/lib/apollo-client"
import { GET_BANK_ACCOUNTS, CREATE_BANK_ACCOUNT } from "@/lib/graphql-queries"

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
  
  // Form states
  const [bankName, setBankName] = useState("")
  const [accountData, setAccountData] = useState({
    accountId: "",
    type: "checking",
    balance: 0,
    currencyCode: "BRL"
  })
  
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
              // Buscar contas reais do banco via GraphQL
              const { data } = await client.query({
                query: GET_BANK_ACCOUNTS,
                variables: { bankId: bank.id },
                fetchPolicy: 'network-only'
              });

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

  // CRUD Functions
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

  const handleCreateAccount = async () => {
    if (!selectedBank || !user?.id || !accountData.accountId.trim()) return

    try {
      // Criar conta diretamente via Apollo Client
      const { data } = await client.mutate({
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
      
      // Recarregar dados dos bancos
      refetch()
    } catch (error) {
      console.error('Error creating account:', error)
    }
  }

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

  const totalBalance = banksWithAccounts.reduce((sum, bank) => sum + (bank.totalBalance || 0), 0)
  const totalAccounts = banksWithAccounts.reduce((sum, bank) => sum + (bank.accounts?.length || 0), 0)
  const favoriteCount = banksWithAccounts.filter(bank => bank.isFavorite).length
  const hasBanks = banks && banks.length > 0

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bancos</h1>
            <p className="text-muted-foreground">
              Gerencie todas suas contas bancárias em um só lugar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => setAddBankOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banco
            </Button>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Bancos</p>
                  <p className="text-2xl font-bold">{hasBanks ? banksWithAccounts.length : 0}</p>
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
                  <p className="text-2xl font-bold">{hasBanks ? totalAccounts : 0}</p>
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
                  <p className="text-2xl font-bold">{hasBanks ? favoriteCount : 0}</p>
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
                    {showBalances ? formatCurrency(hasBanks ? totalBalance : 0) : "••••••"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros e controles - mostrar apenas se há bancos */}
      {hasBanks && (
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
            
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as typeof filterBy)}>
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
            
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
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
      )}

      {/* Lista/Grade de bancos */}
      {!hasBanks ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-blue-100 rounded-full mb-6">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum banco cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Comece adicionando seu primeiro banco para gerenciar suas contas e transações de forma organizada.
            </p>
            <Button onClick={() => setAddBankOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Primeiro Banco
            </Button>
          </CardContent>
        </Card>
      ) : filteredBanks.length === 0 ? (
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
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar busca
                </Button>
              )}
              <Button variant="outline" onClick={() => setFilterBy("all")}>
                Mostrar todos
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredBanks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-md transition-shadow">
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
                      onClick={() => handleToggleFavorite(bank.id)}
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
                        <DropdownMenuItem onClick={() => openEditBank(bank)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAddAccount(bank)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Conta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteConfirm(bank)}
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
                      onClick={() => openAddAccount(bank)}
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
          ))}
        </div>
      )}

      {/* Dialog para adicionar banco */}
      <Dialog open={addBankOpen} onOpenChange={setAddBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Banco</DialogTitle>
            <DialogDescription>
              Adicione um novo banco à sua lista
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Nome do banco</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBankOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBank} disabled={!bankName.trim()}>
              Criar Banco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar banco */}
      <Dialog open={editBankOpen} onOpenChange={setEditBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Banco</DialogTitle>
            <DialogDescription>
              Altere as informações do banco
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBankName">Nome do banco</Label>
              <Input
                id="editBankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBankOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateBank} disabled={!bankName.trim()}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Banco</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o banco "{selectedBank?.name}"? 
              Esta ação não pode ser desfeita e todas as contas associadas também serão removidas.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBank}>
              Excluir Banco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar conta */}
      <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
            <DialogDescription>
              Adicione uma nova conta ao banco {selectedBank?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountId">Número da conta</Label>
              <Input
                id="accountId"
                value={accountData.accountId}
                onChange={(e) => setAccountData(prev => ({ ...prev, accountId: e.target.value }))}
                placeholder="Ex: 12345-6"
              />
            </div>
            
            <div>
              <Label>Tipo da conta</Label>
              <Select 
                value={accountData.type} 
                onValueChange={(value) => setAccountData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Conta Corrente</SelectItem>
                  <SelectItem value="savings">Poupança</SelectItem>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="investment">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="balance">Saldo inicial</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={accountData.balance}
                onChange={(e) => setAccountData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAccountOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAccount}
              disabled={!accountData.accountId.trim()}
            >
              Criar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
