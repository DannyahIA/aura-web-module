"use client";

import { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  CreditCard, 
  Edit, 
  RefreshCcw, 
  Wallet,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatShortDate, EnhancedTransaction } from '@/hooks/use-enhanced-transactions';

interface TransactionsListProps {
  transactions: EnhancedTransaction[];
  onEditTransaction: (transaction: EnhancedTransaction) => void;
  onDeleteTransaction: (transaction: EnhancedTransaction) => void;
  isLoading?: boolean;
  noResultsMessage?: string;
  filterQuery?: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
  };
  onPageChange?: (page: number) => void;
}

export function TransactionsList({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  isLoading = false,
  noResultsMessage = "No transactions found",
  filterQuery = "",
  pagination,
  onPageChange,
}: TransactionsListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-background p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No transactions found</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          {filterQuery 
            ? `Get started by adding your first transaction or adjust your filters to see more results.`
            : `Get started by adding your first transaction or adjust your filters to see more results.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem 
            key={transaction.id} 
            transaction={transaction} 
            onEdit={() => onEditTransaction(transaction)}
            onDelete={() => onDeleteTransaction(transaction)}
          />
        ))}
      </div>
      
      {pagination && pagination.totalItems > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.totalItems)} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} transactions
            </p>
            
            <nav className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              
              {/* Simple page number display for brevity */}
              <div className="flex items-center justify-center h-8 w-8">
                {pagination.page}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.totalItems / pagination.pageSize)}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

interface TransactionItemProps {
  transaction: EnhancedTransaction;
  onEdit: () => void;
  onDelete: () => void;
}

function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isPositive = (transaction.amount || 0) >= 0;
  const icon = getTransactionIcon(transaction.type);
  const formattedAmount = formatCurrency(transaction.amount, transaction.currency);
  const displayAmount = isPositive 
    ? `+${formattedAmount}`
    : formattedAmount;
  
  const amountColor = isPositive ? 'text-emerald-500' : 'text-gray-800';
  const statusVariant = getStatusVariant(transaction.status);
  const formattedDate = formatShortDate(transaction.transactionDate || '');

  return (
    <div className="group rounded-lg border bg-background p-4 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isPositive ? 'bg-emerald-50' : 'bg-gray-50'}`}>
            {icon}
          </div>
          
          <div>
            <h3 className="font-medium">{transaction.description}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
              {transaction.bankName && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{transaction.bankName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className={`font-medium ${amountColor}`}>{displayAmount}</span>
            <span className="text-sm text-muted-foreground">{transaction.type}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>
              {transaction.status}
            </Badge>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit transaction</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete transaction</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTransactionIcon(type?: string) {
  switch (type) {
    case 'Payment':
      return <CreditCard className="h-5 w-5 text-emerald-500" />;
    case 'Transfer':
      return <RefreshCcw className="h-5 w-5 text-blue-500" />;
    case 'Deposit':
      return <ArrowDown className="h-5 w-5 text-emerald-500" />;
    case 'Withdrawal':
      return <ArrowUp className="h-5 w-5 text-rose-500" />;
    case 'Refund':
      return <RefreshCcw className="h-5 w-5 text-amber-500" />;
    default:
      return <DollarSign className="h-5 w-5 text-gray-500" />;
  }
}

function getStatusVariant(status?: string) {
  switch (status) {
    case 'Completed':
      return 'outline';
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
}
