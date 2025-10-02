"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  EnhancedTransaction,
  getTransactionTypeOptions, 
  getTransactionStatusOptions 
} from '@/hooks/use-enhanced-transactions';
import { TransactionType } from '@/lib/types';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: EnhancedTransaction;
  onSave: (transaction: Partial<TransactionType>) => void;
  onDelete?: (id: string) => void;
  mode: 'add' | 'edit';
  bankOptions: { label: string; value: string }[];
}

export function TransactionDialog({ 
  open, 
  onOpenChange, 
  transaction,
  onSave,
  onDelete,
  mode = 'add',
  bankOptions
}: TransactionDialogProps) {
  const [formData, setFormData] = useState<Partial<EnhancedTransaction>>({
    description: '',
    bankId: '',
    transactionDate: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'Payment',
    status: 'Completed',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        ...transaction,
        transactionDate: transaction.transactionDate 
          ? new Date(transaction.transactionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else if (mode === 'add') {
      setFormData({
        description: '',
        bankId: '',
        transactionDate: new Date().toISOString().split('T')[0],
        amount: 0,
        type: 'Payment',
        status: 'Completed',
      });
    }
  }, [transaction, mode, open]);

  const handleChange = (field: keyof EnhancedTransaction, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Convert date to ISO format if it exists
    let transactionDateISO = undefined;
    if (formData.transactionDate) {
      // Create a Date object from the date string and set it to start of day in UTC
      const date = new Date(formData.transactionDate + 'T00:00:00.000Z');
      transactionDateISO = date.toISOString();
    }
    
    const transactionData = {
      ...formData,
      amount: formData.amount,
      transactionDate: transactionDateISO
    };
    
    onSave(transactionData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (transaction && onDelete) {
      onDelete(transaction.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  const title = mode === 'add' ? 'Add Transaction' : 'Edit Transaction';
  const subtitle = mode === 'add' 
    ? 'Enter the details for the new transaction.'
    : 'Update the transaction details below.';

  const actionButton = mode === 'add' 
    ? <Button onClick={handleSave}>Add Transaction</Button>
    : <Button onClick={handleSave}>Save Changes</Button>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="transaction-dialog-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <p id="transaction-dialog-description" className="text-sm text-muted-foreground">{subtitle}</p>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Payment from client"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bank">Bank</Label>
            <Select
              value={formData.bankId || ''}
              onValueChange={(value) => handleChange('bankId', value)}
            >
              <SelectTrigger id="bank">
                <SelectValue placeholder="Select a bank..." />
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.transactionDate || ''}
                  onChange={(e) => handleChange('transactionDate', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  className="pr-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  {getTransactionTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Completed" />
                </SelectTrigger>
                <SelectContent>
                  {getTransactionStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {mode === 'edit' && onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          {actionButton}
        </DialogFooter>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the transaction
                and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
