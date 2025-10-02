"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddBankDialog } from "@/components/banks/add-bank-dialog"
import { AddAccountDialog } from "@/components/banks/add-account-dialog"
import { Building2, Plus, Trash2, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { usePageConfig } from "@/hooks/use-page-config"
import { useBanks } from "@/hooks/use-graphql"
import { useAuth } from "@/contexts/auth-context"
import { BankType } from "@/lib/types"

export function BanksPage() {
  const [addBankOpen, setAddBankOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [selectedBankId, setSelectedBankId] = useState<string>("")
  
  const { user } = useAuth()
  const { banks, loading, error, refetch, createBank, updateBank, deleteBank } = useBanks(user?.id)

  usePageConfig({
    page: "banks",
    title: "Bank Management",
    subtitle: "Connect and manage your bank accounts"
  })

  const handleCreateBank = async (bankData: { name: string }) => {
    if (!user?.id) return

    try {
      await createBank({
        name: bankData.name,
        userId: user.id
      })
      setAddBankOpen(false)
    } catch (error) {
      console.error('Error creating bank:', error)
    }
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
        onAddBank={(bankData) => handleCreateBank({ name: bankData.name })}
      />

      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        bankName={banks.find(bank => bank.id === selectedBankId)?.name || ""}
        onAddAccount={() => {
          setAddAccountOpen(false)
          refetch()
        }}
      />
    </div>
  )
}
