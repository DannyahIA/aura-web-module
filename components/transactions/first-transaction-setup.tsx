"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, CreditCard, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useTransactions, useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"

interface FirstTransactionSetupProps {
  onTransactionCreated: () => void
}

export function FirstTransactionSetup({ onTransactionCreated }: FirstTransactionSetupProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")
  const [bankId, setBankId] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { user } = useAuth()
  const { createTransaction } = useTransactions(user?.id)
  const { banks } = useBanks(user?.id)

  const categories = [
    "Alimentação",
    "Transporte", 
    "Saúde",
    "Educação",
    "Lazer",
    "Compras",
    "Contas",
    "Salário",
    "Freelance",
    "Investimentos",
    "Outros"
  ]

  const quickTransactions = [
    { type: "expense" as const, amount: "50.00", description: "Almoço", category: "Alimentação" },
    { type: "expense" as const, amount: "15.00", description: "Uber", category: "Transporte" },
    { type: "expense" as const, amount: "200.00", description: "Supermercado", category: "Alimentação" },
    { type: "income" as const, amount: "5000.00", description: "Salário", category: "Salário" },
    { type: "expense" as const, amount: "80.00", description: "Internet", category: "Contas" },
    { type: "expense" as const, amount: "45.00", description: "Cinema", category: "Lazer" }
  ]

  const handleQuickSelect = (transaction: typeof quickTransactions[0]) => {
    setAmount(transaction.amount)
    setDescription(transaction.description)
    setTransactionType(transaction.type)
    setCategory(transaction.category)
  }

  const formatCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const amount = parseFloat(numbers) / 100
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrencyInput(value)
    setAmount(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || !bankId || !user?.id || isSubmitting) return

    setIsSubmitting(true)
    try {
      const numericAmount = parseFloat(amount.replace(/\./g, "").replace(",", "."))
      const finalAmount = transactionType === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount)

      await createTransaction({
        amount: finalAmount,
        description: description.trim(),
        bankId,
        type: category || "Outros",
        transactionDate: date.toISOString(),
        currency: "BRL"
      })
      
      onTransactionCreated()
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Se não há bancos, não pode criar transação
  if (!banks || banks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <CreditCard className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle>Adicione um banco primeiro</CardTitle>
            <CardDescription>
              Para registrar transações, você precisa ter pelo menos um banco cadastrado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/banks'}>
              Ir para Bancos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Adicione sua primeira transação</CardTitle>
          <CardDescription>
            Comece a controlar suas finanças registrando uma transação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transações rápidas */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Transações rápidas</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickTransactions.map((transaction, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex-col gap-1"
                  onClick={() => handleQuickSelect(transaction)}
                >
                  {transaction.type === "income" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-xs font-medium">{transaction.description}</span>
                  <span className="text-xs text-muted-foreground">
                    R$ {transaction.amount}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de transação */}
              <div>
                <Label>Tipo</Label>
                <Select value={transactionType} onValueChange={(value: "income" | "expense") => setTransactionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Receita
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Despesa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Valor */}
              <div>
                <Label htmlFor="amount">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0,00"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Almoço no restaurante"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Banco */}
              <div>
                <Label>Banco</Label>
                <Select value={bankId} onValueChange={setBankId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categoria */}
              <div>
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data */}
            <div>
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!amount || !description || !bankId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando transação...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Criar primeira transação
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
