"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BankDialogsProps {
  // Add Bank Dialog
  addBankOpen: boolean
  setAddBankOpen: (open: boolean) => void
  bankName: string
  setBankName: (name: string) => void
  onCreateBank: () => void

  // Edit Bank Dialog
  editBankOpen: boolean
  setEditBankOpen: (open: boolean) => void
  onUpdateBank: () => void

  // Delete Confirmation Dialog
  deleteConfirmOpen: boolean
  setDeleteConfirmOpen: (open: boolean) => void
  selectedBankName?: string
  onDeleteBank: () => void
}

export function BankDialogs({
  addBankOpen,
  setAddBankOpen,
  bankName,
  setBankName,
  onCreateBank,
  editBankOpen,
  setEditBankOpen,
  onUpdateBank,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  selectedBankName,
  onDeleteBank
}: BankDialogsProps) {
  return (
    <>
      {/* Dialog para adicionar banco */}
      <Dialog open={addBankOpen} onOpenChange={setAddBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Banco</DialogTitle>
            <DialogDescription>
              Adicione um novo banco à sua lista
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Nome do banco</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBankOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onCreateBank} disabled={!bankName.trim()}>
              Criar Banco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar banco */}
      <Dialog open={editBankOpen} onOpenChange={setEditBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Banco</DialogTitle>
            <DialogDescription>
              Altere as informações do banco
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBankName">Nome do banco</Label>
              <Input
                id="editBankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBankOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onUpdateBank} disabled={!bankName.trim()}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Banco</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o banco "{selectedBankName}"? 
              Esta ação não pode ser desfeita e todas as contas associadas também serão removidas.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDeleteBank}>
              Excluir Banco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
