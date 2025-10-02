"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2 } from "lucide-react"
import { useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"

interface FirstBankSetupProps {
  onBankCreated: () => void
}

export function FirstBankSetup({ onBankCreated }: FirstBankSetupProps) {
  const [bankName, setBankName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  
  const { user } = useAuth()
  const { createBank } = useBanks(user?.id)

  const popularBanks = [
    { id: "nubank", name: "Nubank", color: "bg-purple-500" },
    { id: "itau", name: "Itaú", color: "bg-orange-500" },
    { id: "bradesco", name: "Bradesco", color: "bg-red-500" },
    { id: "santander", name: "Santander", color: "bg-red-600" },
    { id: "bb", name: "Banco do Brasil", color: "bg-yellow-500" },
    { id: "caixa", name: "Caixa", color: "bg-blue-600" },
    { id: "inter", name: "Banco Inter", color: "bg-orange-600" },
    { id: "c6", name: "C6 Bank", color: "bg-gray-800" },
  ]

  const handlePresetSelect = (bankName: string) => {
    setSelectedPreset(bankName)
    setBankName(bankName)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankName.trim() || !user?.id || isSubmitting) return

    setIsSubmitting(true)
    try {
      await createBank({
        name: bankName.trim(),
        userId: user.id
      })
      onBankCreated()
    } catch (error) {
      console.error('Error creating bank:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Adicione seu primeiro banco</CardTitle>
          <CardDescription>
            Para começar a gerenciar suas finanças, adicione seu primeiro banco ou instituição financeira
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bancos populares */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Bancos populares</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularBanks.map((bank) => (
                <Button
                  key={bank.id}
                  variant={selectedPreset === bank.name ? "default" : "outline"}
                  className="h-12 flex-col gap-1"
                  onClick={() => handlePresetSelect(bank.name)}
                >
                  <div className={`w-3 h-3 rounded-full ${bank.color}`} />
                  <span className="text-xs">{bank.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bankName">Nome do banco</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Digite o nome do banco ou escolha um acima"
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!bankName.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando banco...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Criar primeiro banco
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
