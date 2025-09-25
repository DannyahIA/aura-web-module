"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TransactionFiltersProps {
  selectedBank: string
  setSelectedBank: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedPaymentMethod: string
  setSelectedPaymentMethod: (value: string) => void
  selectedType: string
  setSelectedType: (value: string) => void
  dateRange: { from: string; to: string }
  setDateRange: (range: { from: string; to: string }) => void
  banks: { id: string; name: string }[]
  categories: string[]
}

const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "transfer", label: "Transfer" },
  { value: "boleto", label: "Boleto" },
  { value: "cash", label: "Cash" },
]

export function TransactionFilters({
  selectedBank,
  setSelectedBank,
  selectedCategory,
  setSelectedCategory,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedType,
  setSelectedType,
  dateRange,
  setDateRange,
  banks,
  categories,
}: TransactionFiltersProps) {
  const clearAllFilters = () => {
    setSelectedBank("all")
    setSelectedCategory("all")
    setSelectedPaymentMethod("all")
    setSelectedType("all")
    setDateRange({ from: "", to: "" })
  }

  const hasActiveFilters =
    selectedBank !== "all" ||
    selectedCategory !== "all" ||
    selectedPaymentMethod !== "all" ||
    selectedType !== "all" ||
    dateRange.from ||
    dateRange.to

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="bank-filter">Bank</Label>
        <Select value={selectedBank} onValueChange={setSelectedBank}>
          <SelectTrigger>
            <SelectValue placeholder="All banks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All banks</SelectItem>
            {banks.map((bank) => (
              <SelectItem key={bank.id} value={bank.id}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-filter">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-method-filter">Payment Method</Label>
        <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="All methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {paymentMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter">Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="credit">Income</SelectItem>
            <SelectItem value="debit">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-from">Start Date</Label>
        <Input
          id="date-from"
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-to">End Date</Label>
        <Input
          id="date-to"
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
      </div>

      {hasActiveFilters && (
        <div className="md:col-span-2 lg:col-span-3 flex justify-center">
          <Button variant="outline" onClick={clearAllFilters} className="w-full md:w-auto bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
