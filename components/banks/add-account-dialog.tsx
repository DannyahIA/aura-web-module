"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, PiggyBank } from "lucide-react"

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: (accountData: { name: string; type: "checking" | "savings" | "credit" }) => void
  bankName: string
}

const accountTypes = [
  { value: "checking", label: "Checking Account", icon: Wallet },
  { value: "savings", label: "Savings", icon: PiggyBank },
  { value: "credit", label: "Credit Card", icon: CreditCard },
]

export function AddAccountDialog({ open, onOpenChange, onAddAccount, bankName }: AddAccountDialogProps) {
  const [accountData, setAccountData] = useState({
    name: "",
    type: "" as "checking" | "savings" | "credit" | "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (accountData.name && accountData.type) {
      onAddAccount({
        name: accountData.name,
        type: accountData.type,
      })

      setAccountData({ name: "", type: "" })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Add Account</DialogTitle>
          <DialogDescription>Add a new account for {bankName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Account Name</Label>
            <Input
              id="account-name"
              placeholder="E.g.: Checking Account, Nu Business, Savings"
              value={accountData.name}
              onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-type">Account Type</Label>
            <Select
              value={accountData.type}
              onValueChange={(value) => setAccountData({ ...accountData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> After adding the account, you will need to connect it using your bank credentials to synchronize the data.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!accountData.name || !accountData.type} className="flex-1">
              Add Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
