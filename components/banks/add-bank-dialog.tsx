"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2 } from "lucide-react"

interface AddBankDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBankAdded: (bankData: { name: string }) => Promise<void>
}

const popularBanks = [
  { name: "Nubank", color: "#8A05BE" },
  { name: "Itaú", color: "#EC7000" },
  { name: "Banco do Brasil", color: "#FFF100" },
  { name: "Bradesco", color: "#CC092F" },
  { name: "Santander", color: "#EC0000" },
  { name: "Caixa Econômica Federal", color: "#0066B3" },
  { name: "Banco Inter", color: "#FF7A00" },
  { name: "C6 Bank", color: "#000000" },
  { name: "PicPay", color: "#21C25E" },
  { name: "Next", color: "#7B68EE" },
]

export function AddBankDialog({ open, onOpenChange, onBankAdded }: AddBankDialogProps) {
  const [selectedBank, setSelectedBank] = useState<(typeof popularBanks)[0] | null>(null)
  const [customBank, setCustomBank] = useState({ name: "" })
  const [isCustom, setIsCustom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      let bankName = ""
      
      if (selectedBank && !isCustom) {
        bankName = selectedBank.name
      } else if (isCustom && customBank.name) {
        bankName = customBank.name
      }

      if (!bankName) {
        setError("Por favor, selecione ou digite o nome do banco")
        return
      }

      await onBankAdded({ name: bankName })

      // Reset form
      setSelectedBank(null)
      setCustomBank({ name: "" })
      setIsCustom(false)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar banco")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedBank(null)
    setCustomBank({ name: "" })
    setIsCustom(false)
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Adicionar Banco</DialogTitle>
          <DialogDescription>Escolha um banco da lista ou adicione um personalizado</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isCustom ? (
            <>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {popularBanks.map((bank) => (
                  <button
                    key={bank.name}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      selectedBank?.name === bank.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{bank.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <Button type="button" variant="link" onClick={() => setIsCustom(true)}>
                  Não encontrou seu banco? Adicionar personalizado
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Nome do Banco</Label>
                <Input
                  id="bank-name"
                  placeholder="Ex: Meu Banco"
                  value={customBank.name}
                  onChange={(e) => setCustomBank({ ...customBank, name: e.target.value })}
                  required
                />
              </div>

              <div className="text-center">
                <Button type="button" variant="link" onClick={() => setIsCustom(false)}>
                  Voltar para lista de bancos
                </Button>
              </div>
            </>
          )}

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
              disabled={(!selectedBank && (!isCustom || !customBank.name)) || isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
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