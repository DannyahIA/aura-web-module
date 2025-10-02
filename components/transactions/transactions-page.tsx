"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { EmptyTransactions } from "@/components/ui/empty-states"
import { usePageConfig } from "@/hooks/use-page-config"
import { useTransactions } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"
import { TransactionType } from "@/lib/types"
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building2,
  ShoppingCart,
  Search,
  Filter,
  Download,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react"

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: "all" as "all" | "7d" | "30d" | "90d",
    type: "all" as "all" | "debit" | "credit",
    category: "all",
    bank: "all",
    amountRange: { min: "", max: "" }
  })

  const { user } = useAuth()
  const { transactions, loading, error, refetch, createTransaction } = useTransactions(user?.id)

  usePageConfig({
    page: "transactions",
    title: "Transaction History",
    subtitle: "View and manage your transaction history"
  })

  const getTransactionIcon = (description?: string) => {
    if (!description) return <CreditCard className="h-4 w-4" />
    
    const desc = description.toLowerCase()
    if (desc.includes("pix")) return <Smartphone className="h-4 w-4" />
    if (desc.includes("transfer")) return <ArrowUpRight className="h-4 w-4" />
    if (desc.includes("shopping") || desc.includes("store")) return <ShoppingCart className="h-4 w-4" />
    if (desc.includes("bank")) return <Building2 className="h-4 w-4" />
    return <CreditCard className="h-4 w-4" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      if (searchTerm && !transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      return true
    })
  }, [transactions, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Carregando transações...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyTransactions
        onAddTransaction={() => setAddTransactionOpen(true)}
        onRetry={refetch}
        isError={true}
        errorMessage={error}
      />
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyTransactions
        onAddTransaction={() => setAddTransactionOpen(true)}
        onRetry={refetch}
        isError={false}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seu histórico de transações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setAddTransactionOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtersOpen && (
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Filtros avançados em desenvolvimento...</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(false)}
              className="mt-2"
            >
              Fechar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                filteredTransactions
                  .filter(t => (t.amount || 0) > 0)
                  .reduce((sum, t) => sum + (t.amount || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(
                Math.abs(filteredTransactions
                  .filter(t => (t.amount || 0) < 0)
                  .reduce((sum, t) => sum + (t.amount || 0), 0))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Tente ajustar os filtros de busca" : "Não há transações para exibir"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction: TransactionType) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      {getTransactionIcon(transaction.description)}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {transaction.description || 'Transação sem descrição'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.transactionDate ? formatDate(transaction.transactionDate) : 'Data não informada'}</span>
                        {transaction.type && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      (transaction.amount || 0) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.amount ? formatCurrency(transaction.amount) : 'R$ 0,00'}
                    </p>
                    {transaction.currency && transaction.currency !== 'BRL' && (
                      <p className="text-xs text-muted-foreground">
                        {transaction.currency}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={addTransactionOpen}
        onOpenChange={setAddTransactionOpen}
        onTransactionAdded={() => {
          refetch()
          setAddTransactionOpen(false)
        }}
      />
    </div>
  )
}
