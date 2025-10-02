"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AccountData {
  accountId: string
  type: string
  balance: number
  currencyCode: string
}

interface AccountDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedBankName?: string
  accountData: AccountData
  setAccountData: (data: AccountData) => void
  onCreateAccount: () => void
}

export function AccountDialog({
  open,
  setOpen,
  selectedBankName,
  accountData,
  setAccountData,
  onCreateAccount
}: AccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
          <DialogDescription>
            Adicione uma nova conta ao banco {selectedBankName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountId">Número da conta</Label>
            <Input
              id="accountId"
              value={accountData.accountId}
              onChange={(e) => setAccountData({ ...accountData, accountId: e.target.value })}
              placeholder="Ex: 12345-6"
            />
          </div>
          
          <div>
            <Label>Tipo da conta</Label>
            <Select 
              value={accountData.type} 
              onValueChange={(value) => setAccountData({ ...accountData, type: value })}
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
              onChange={(e) => setAccountData({ ...accountData, balance: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onCreateAccount}
            disabled={!accountData.accountId.trim()}
          >
            Criar Conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
