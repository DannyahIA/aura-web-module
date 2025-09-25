"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { usePageConfig } from "@/hooks/use-page-config"
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building2,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Search,
  Filter,
  Download,
  Calendar,
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "debit" | "credit"
  category: string
  paymentMethod: "pix" | "credit_card" | "debit_card" | "transfer" | "boleto" | "cash"
  bankId: string
  bankName: string
  accountName: string
  merchant?: string
  location?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15T14:30:00Z",
    description: "PIX Transfer - João Silva",
    amount: -250.0,
    type: "debit",
    category: "Transfer",
    paymentMethod: "pix",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Nu Account",
    merchant: "João Silva",
  },
  {
    id: "2",
    date: "2024-01-15T12:15:00Z",
    description: "Salary - Company XYZ",
    amount: 5500.0,
    type: "credit",
    category: "Salary",
    paymentMethod: "transfer",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Nu Account",
    merchant: "Company XYZ",
  },
  {
    id: "3",
    date: "2024-01-15T10:45:00Z",
    description: "Uber - Ride",
    amount: -18.5,
    type: "debit",
    category: "Transport",
    paymentMethod: "credit_card",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Credit Card",
    merchant: "Uber",
    location: "São Paulo, SP",
  },
  {
    id: "4",
    date: "2024-01-14T19:20:00Z",
    description: "iFood - Dinner",
    amount: -45.9,
    type: "debit",
    category: "Food",
    paymentMethod: "credit_card",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Credit Card",
    merchant: "iFood",
  },
  {
    id: "5",
    date: "2024-01-14T16:30:00Z",
    description: "Shell Gas Station - Fuel",
    amount: -120.0,
    type: "debit",
    category: "Fuel",
    paymentMethod: "debit_card",
    bankId: "2",
    bankName: "Itaú",
    accountName: "Checking Account",
    merchant: "Shell Gas Station",
    location: "São Paulo, SP",
  },
  {
    id: "6",
    date: "2024-01-14T14:15:00Z",
    description: "Pão de Açúcar Market",
    amount: -89.75,
    type: "debit",
    category: "Supermarket",
    paymentMethod: "debit_card",
    bankId: "2",
    bankName: "Itaú",
    accountName: "Checking Account",
    merchant: "Pão de Açúcar",
  },
  {
    id: "7",
    date: "2024-01-13T11:00:00Z",
    description: "Starbucks - Coffee",
    amount: -15.9,
    type: "debit",
    category: "Food",
    paymentMethod: "credit_card",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Credit Card",
    merchant: "Starbucks",
    location: "São Paulo, SP",
  },
  {
    id: "8",
    date: "2024-01-13T09:30:00Z",
    description: "Electricity Bill - ENEL",
    amount: -245.0,
    type: "debit",
    category: "Utilities",
    paymentMethod: "boleto",
    bankId: "2",
    bankName: "Itaú",
    accountName: "Checking Account",
    merchant: "ENEL",
  },
  {
    id: "9",
    date: "2024-01-12T15:45:00Z",
    description: "Freelance - Client ABC",
    amount: 1200.0,
    type: "credit",
    category: "Freelance",
    paymentMethod: "pix",
    bankId: "3",
    bankName: "Banco do Brasil",
    accountName: "Checking Account",
    merchant: "Client ABC",
  },
  {
    id: "10",
    date: "2024-01-12T13:20:00Z",
    description: "Netflix - Subscription",
    amount: -29.9,
    type: "debit",
    category: "Entertainment",
    paymentMethod: "credit_card",
    bankId: "1",
    bankName: "Nubank",
    accountName: "Credit Card",
    merchant: "Netflix",
  },
]

const banks = [
  { id: "1", name: "Nubank" },
  { id: "2", name: "Itaú" },
  { id: "3", name: "Banco do Brasil" },
]

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBank, setSelectedBank] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [showFilters, setShowFilters] = useState(false)

  // Configure page information
  usePageConfig({
    page: "transactions",
    title: "Transactions",
    subtitle: "View and manage all your transactions"
  })

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBank = selectedBank === "all" || transaction.bankId === selectedBank
      const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory
      const matchesPaymentMethod =
        selectedPaymentMethod === "all" || transaction.paymentMethod === selectedPaymentMethod
      const matchesType = selectedType === "all" || transaction.type === selectedType

      const matchesDateRange =
        (!dateRange.from || new Date(transaction.date) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(transaction.date) <= new Date(dateRange.to))

      return matchesSearch && matchesBank && matchesCategory && matchesPaymentMethod && matchesType && matchesDateRange
    })
  }, [searchTerm, selectedBank, selectedCategory, selectedPaymentMethod, selectedType, dateRange])

  const getPaymentMethodIcon = (method: Transaction["paymentMethod"]) => {
    switch (method) {
      case "pix":
        return <Smartphone className="h-4 w-4" />
      case "credit_card":
      case "debit_card":
        return <CreditCard className="h-4 w-4" />
      case "transfer":
        return <Building2 className="h-4 w-4" />
      case "boleto":
        return <Calendar className="h-4 w-4" />
      case "cash":
        return <Coffee className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentMethodLabel = (method: Transaction["paymentMethod"]) => {
    switch (method) {
      case "pix":
        return "PIX"
      case "credit_card":
        return "Credit Card"
      case "debit_card":
        return "Debit Card"
      case "transfer":
        return "Transfer"
      case "boleto":
        return "Boleto"
      case "cash":
        return "Cash"
      default:
        return method
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "transport":
        return <Car className="h-4 w-4" />
      case "food":
        return <Coffee className="h-4 w-4" />
      case "supermarket":
        return <ShoppingCart className="h-4 w-4" />
      case "utilities":
        return <Home className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(value))
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const totalCredit = filteredTransactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)

  const totalDebit = filteredTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netAmount = totalCredit - totalDebit

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat text-green-600">{formatCurrency(totalCredit)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "credit").length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat text-red-600">{formatCurrency(totalDebit)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "debit").length} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold font-montserrat ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(netAmount)}
                </div>
                <p className="text-xs text-muted-foreground">{filteredTransactions.length} filtered transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-montserrat">Filters and Search</CardTitle>
                  <CardDescription>Find specific transactions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide" : "Show"} Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description, merchant or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <TransactionFilters
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  banks={banks}
                  categories={Array.from(new Set(mockTransactions.map((t) => t.category)))}
                />
              )}
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Transactions</CardTitle>
              <CardDescription>
                {filteredTransactions.length} of {mockTransactions.length} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(transaction.category)}
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {getPaymentMethodLabel(transaction.paymentMethod)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(transaction.date)}</span>
                          <span>•</span>
                          <span>
                            {transaction.bankName} - {transaction.accountName}
                          </span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                          {transaction.location && (
                            <>
                              <span>•</span>
                              <span>{transaction.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-semibold text-lg ${
                          transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {transaction.merchant && <p className="text-sm text-muted-foreground">{transaction.merchant}</p>}
                    </div>
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting the filters or search term to find transactions
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
