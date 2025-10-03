"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionsSearch } from './transactions-search';
import { TransactionsList } from './transactions-list';
import { TransactionDialog } from './transaction-dialog';
import { 
  EnhancedTransaction, 
  useEnhancedTransactions,
  getTransactionTypeOptions, 
  getTransactionStatusOptions,
  TransactionFilters
} from '@/hooks/use-enhanced-transactions';
import { TransactionType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function TransactionsPage() {
  const { toast } = useToast();
  const {
    transactions,
    loading,
    error,
    totalItems,
    pagination,
    filters,
    updateFilters,
    updatePagination,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getBankFilterOptions,
    getAllUserBanks,
    refetch
  } = useEnhancedTransactions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedTransaction, setSelectedTransaction] = useState<EnhancedTransaction | undefined>(undefined);
  const [bankFilterOptions, setBankFilterOptions] = useState<{label: string, value: string}[]>([]);
  const [allUserBanks, setAllUserBanks] = useState<{label: string, value: string}[]>([]);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<EnhancedTransaction | undefined>(undefined);

  // Update bank options when transactions change
  useEffect(() => {
    setBankFilterOptions(getBankFilterOptions());
    setAllUserBanks(getAllUserBanks());
  }, [getBankFilterOptions, getAllUserBanks]);

  const handleAddTransaction = () => {
    setSelectedTransaction(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditTransaction = (transaction: EnhancedTransaction) => {
    setSelectedTransaction(transaction);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteTransaction = (transaction: EnhancedTransaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete?.id) return;
    
    try {
      await deleteTransaction(transactionToDelete.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      setDeleteDialogOpen(false);
      setTransactionToDelete(undefined);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete transaction",
      });
    }
  };

  const handleSaveTransaction = async (data: Partial<TransactionType>) => {
    try {
      console.log('Save transaction called with mode:', dialogMode, 'data:', data);
      
      if (dialogMode === 'add') {
        console.log('Creating new transaction...');
        await createTransaction({
          bankId: data.bankId || '',
          type: data.type,
          amount: data.amount,
          currency: data.currency || 'USD',
          description: data.description,
          transactionDate: data.transactionDate
        });
        
        toast({
          title: "Transaction added",
          description: "Your transaction has been successfully added."
        });
      } else if (dialogMode === 'edit' && selectedTransaction) {
        console.log('Updating existing transaction...');
        await updateTransaction(selectedTransaction.id, {
          type: data.type,
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          transactionDate: data.transactionDate
        });
        
        toast({
          title: "Transaction updated",
          description: "Your transaction has been successfully updated."
        });
      }
    } catch (err) {
      console.error('Error in handleSaveTransaction:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleSearch = (query: string) => {
    updateFilters({ searchQuery: query });
  };

  const handleBankFilterChange = (value: string) => {
    updateFilters({ bankId: value === 'all' ? undefined : value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value === 'all' ? undefined : value });
  };

  const handleTypeFilterChange = (value: string) => {
    updateFilters({ type: value === 'all' ? undefined : value });
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "Export started",
      description: "Your transactions are being exported to CSV."
    });
  };

  return (
    <div className="container px-4 py-6 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your transaction history. Track payments, transfers, and account activity.
            </p>
          </div>
          <Button onClick={handleAddTransaction} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <TransactionsSearch
            onSearch={handleSearch}
            placeholder="Search transactions..."
          />
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.bankId || 'all'}
              onValueChange={handleBankFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Banks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                {bankFilterOptions.slice(1).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {getTransactionStatusOptions().slice(1).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type || 'all'}
              onValueChange={handleTypeFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getTransactionTypeOptions().slice(1).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <TransactionsList
          transactions={transactions}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          isLoading={loading}
          filterQuery={filters.searchQuery}
          pagination={{
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalItems: totalItems
          }}
          onPageChange={handlePageChange}
        />
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        onSave={handleSaveTransaction}
        mode={dialogMode}
        bankOptions={allUserBanks}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
              {transactionToDelete && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="text-sm font-medium">{transactionToDelete.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Amount: {transactionToDelete.amount} {transactionToDelete.currency}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
