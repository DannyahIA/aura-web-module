"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ArrowUpDown, Loader2, Calendar } from "lucide-react"
import client from "@/lib/apollo-client"
import { CREATE_TRANSACTION } from "@/lib/graphql-queries"
import { useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransactionAdded: () => void
}

const transactionTypes = [
  { value: "income", label: "Receita", icon: Plus, color: "text-green-600" },
  { value: "expense", label: "Despesa", icon: Minus, color: "text-red-600" },
  { value: "transfer", label: "Transferência", icon: ArrowUpDown, color: "text-blue-600" },
]

export function AddTransactionDialog({ open, onOpenChange, onTransactionAdded }: AddTransactionDialogProps) {
  const { user } = useAuth()
  const { banks } = useBanks(user?.id)
  
  const [transactionData, setTransactionData] = useState({
    bankId: "",
    type: "" as "income" | "expense" | "transfer" | "",
    amount: "",
    currency: "BRL",
    description: "",
    transactionDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!transactionData.bankId) {
      setError("Selecione um banco")
      setIsSubmitting(false)
      return
    }

    if (!transactionData.amount || parseFloat(transactionData.amount) <= 0) {
      setError("Insira um valor válido")
      setIsSubmitting(false)
      return
    }

    try {
      let amount = parseFloat(transactionData.amount)
      
      // Se for despesa, tornar o valor negativo
      if (transactionData.type === "expense") {
        amount = -Math.abs(amount)
      } else if (transactionData.type === "income") {
        amount = Math.abs(amount)
      }

      const { data } = await client.mutate({
        mutation: CREATE_TRANSACTION,
        variables: {
          input: {
            bankId: transactionData.bankId,
            type: transactionData.type,
            amount: amount,
            currency: transactionData.currency,
            description: transactionData.description || undefined,
            transactionDate: new Date(transactionData.transactionDate).toISOString(),
          }
        }
      })

      if ((data as any)?.createTransaction) {
        setTransactionData({
          bankId: "",
          type: "",
          amount: "",
          currency: "BRL",
          description: "",
          transactionDate: new Date().toISOString().slice(0, 16),
        })
        onTransactionAdded()
        onOpenChange(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar transação")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTransactionData({
      bankId: "",
      type: "",
      amount: "",
      currency: "BRL",
      description: "",
      transactionDate: new Date().toISOString().slice(0, 16),
    })
    setError("")
    onOpenChange(false)
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return ""
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Adicionar Transação</DialogTitle>
          <DialogDescription>Registre uma nova transação manual</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Select
              value={transactionData.bankId}
              onValueChange={(value) => setTransactionData({ ...transactionData, bankId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name || `Banco ${bank.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo da Transação</Label>
            <Select
              value={transactionData.type}
              onValueChange={(value) => setTransactionData({ ...transactionData, type: value as "income" | "expense" | "transfer" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transactionData.amount}
                onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                required
              />
              {transactionData.amount && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {formatCurrency(transactionData.amount)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Transação</Label>
            <div className="relative">
              <Input
                id="date"
                type="datetime-local"
                value={transactionData.transactionDate}
                onChange={(e) => setTransactionData({ ...transactionData, transactionDate: e.target.value })}
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ex: Pagamento de conta, Salário, Transferência..."
              value={transactionData.description}
              onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={transactionData.currency}
              onValueChange={(value) => setTransactionData({ ...transactionData, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (BRL)</SelectItem>
                <SelectItem value="USD">Dólar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!transactionData.bankId || !transactionData.type || !transactionData.amount || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
