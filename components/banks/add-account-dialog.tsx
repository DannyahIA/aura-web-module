"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, PiggyBank, Loader2 } from "lucide-react"
import client from "@/lib/apollo-client"
import { CREATE_BANK_ACCOUNT } from "@/lib/graphql-queries"

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bankId: string
  onAccountAdded: () => void
}

const accountTypes = [
  { value: "checking", label: "Conta Corrente", icon: Wallet },
  { value: "savings", label: "Poupança", icon: PiggyBank },
  { value: "credit", label: "Cartão de Crédito", icon: CreditCard },
]

export function AddAccountDialog({ open, onOpenChange, bankId, onAccountAdded }: AddAccountDialogProps) {
  const [accountData, setAccountData] = useState({
    accountId: "",
    type: "" as "checking" | "savings" | "credit" | "",
    balance: "",
    currencyCode: "BRL",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!bankId) {
      setError("ID do banco não encontrado")
      setIsSubmitting(false)
      return
    }

    try {
      const { data } = await client.mutate({
        mutation: CREATE_BANK_ACCOUNT,
        variables: {
          input: {
            bankId,
            accountId: accountData.accountId || undefined,
            type: accountData.type || undefined,
            balance: accountData.balance ? parseFloat(accountData.balance) : undefined,
            currencyCode: accountData.currencyCode,
          }
        }
      })

      if ((data as any)?.createBankAccount) {
        setAccountData({ accountId: "", type: "", balance: "", currencyCode: "BRL" })
        onAccountAdded()
        onOpenChange(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setAccountData({ accountId: "", type: "", balance: "", currencyCode: "BRL" })
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Adicionar Conta</DialogTitle>
          <DialogDescription>Adicione uma nova conta bancária</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-id">ID da Conta (opcional)</Label>
            <Input
              id="account-id"
              placeholder="Ex: 12345-6"
              value={accountData.accountId}
              onChange={(e) => setAccountData({ ...accountData, accountId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-type">Tipo da Conta</Label>
            <Select
              value={accountData.type}
              onValueChange={(value) => setAccountData({ ...accountData, type: value as "checking" | "savings" | "credit" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo da conta" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial (opcional)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={accountData.balance}
              onChange={(e) => setAccountData({ ...accountData, balance: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              value={accountData.currencyCode}
              onValueChange={(value) => setAccountData({ ...accountData, currencyCode: value })}
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
              disabled={!accountData.type || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
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
