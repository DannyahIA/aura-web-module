import { useState, useEffect, useCallback } from 'react';
import client from '@/lib/apollo-client';
import { useAuth } from '@/contexts/auth-context';
import {
  GET_TRANSACTIONS_BY_USER_ID,
  GET_TRANSACTIONS_BY_BANK_ID,
  GET_TRANSACTIONS_BY_DATE_RANGE,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  GET_BANKS_BY_USER_ID
} from '@/lib/graphql-queries'; // Usando o arquivo principal de queries
import { TransactionType, BankType } from '@/lib/types';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface EnhancedTransaction extends TransactionType {
  status: TransactionStatus;
  bankName?: string;
}

export interface TransactionFilters {
  bankId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export const useEnhancedTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<EnhancedTransaction[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 10
  });
  
  const [totalItems, setTotalItems] = useState(0);

  // Fetch banks to map bank names to transactions
  const fetchBanks = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data } = await client.query({
        query: GET_BANKS_BY_USER_ID,
        variables: { userId: user.id },
        fetchPolicy: 'network-only'
      });
      
      setBanks((data as any)?.banksByUserId || []);
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  }, [user]);

  // Fetch transactions with filters
  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = GET_TRANSACTIONS_BY_USER_ID;
      let variables: any = { userId: user.id };

      // If bank filter is applied, use the bank-specific query
      if (filters.bankId) {
        query = GET_TRANSACTIONS_BY_BANK_ID;
        variables = { bankId: filters.bankId };
      }

      // If date range filter is applied
      if (filters.startDate && filters.endDate) {
        query = GET_TRANSACTIONS_BY_DATE_RANGE;
        variables = {
          ...variables,
          startDate: filters.startDate,
          endDate: filters.endDate
        };
      }

      const { data } = await client.query({
        query,
        variables,
        fetchPolicy: 'network-only'
      });
      
      // Get the right data property based on the query used
      let transactionData: TransactionType[] = [];
      if (filters.bankId) {
        transactionData = (data as any)?.transactionsByBankId || [];
      } else if (filters.startDate && filters.endDate) {
        transactionData = (data as any)?.transactionsByDateRange || [];
      } else {
        transactionData = (data as any)?.transactionsByUserId || [];
      }
      
      // Apply client-side filtering
      let filteredTransactions = transactionData;
      
      // Apply type filter
      if (filters.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }
      
      // Apply search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t => 
          t.description?.toLowerCase().includes(query) || 
          t.type?.toLowerCase().includes(query) || 
          t.amount?.toString().includes(query)
        );
      }

      // Set the total count for pagination
      setTotalItems(filteredTransactions.length);

      // Apply pagination
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      filteredTransactions = filteredTransactions.slice(start, end);
      
      // Enhance transactions with bank names and default status
      const enhancedTransactions = filteredTransactions.map(transaction => {
        const bank = banks.find(b => b.id === transaction.bankId);
        return {
          ...transaction,
          bankName: bank?.name || `Bank ${transaction.bankId}`,
          status: determineTransactionStatus(transaction)
        };
      });
      
      setTransactions(enhancedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user, filters, banks, pagination]);

  // Determine transaction status based on data
  const determineTransactionStatus = (transaction: TransactionType): TransactionStatus => {
    // This is a placeholder. In a real app, you'd have status in your schema
    // or some logic to determine it.
    const transactionDate = transaction.transactionDate 
      ? new Date(transaction.transactionDate) 
      : null;
    
    if (!transactionDate) return 'Pending';
    
    const now = new Date();
    // If transaction is from the future, mark as pending
    if (transactionDate > now) return 'Pending';
    
    // Otherwise assume completed (this should be replaced with real logic)
    return 'Completed';
  };

  // Helper function to enhance a transaction with computed fields
  const enhanceTransaction = (transaction: TransactionType): EnhancedTransaction => {
    const bankName = banks.find(bank => bank.id === transaction.bankId)?.name;
    const status = determineTransactionStatus(transaction);
    
    return {
      ...transaction,
      status,
      bankName
    };
  };

  // Create a new transaction
  const createTransaction = async (input: {
    bankId: string;
    type?: string;
    amount?: number;
    currency?: string;
    description?: string;
    transactionDate?: string;
  }) => {
    try {
      console.log('Creating transaction with input:', input);
      
      const { data } = await client.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input },
        refetchQueries: [
          { query: GET_TRANSACTIONS_BY_USER_ID, variables: { userId: user?.id } }
        ],
        awaitRefetchQueries: true
      });
      
      console.log('Transaction created successfully:', data);
      
      // Update local state immediately
      const newTransaction = (data as any)?.createTransaction;
      if (newTransaction) {
        const enhancedTransaction = enhanceTransaction(newTransaction);
        setTransactions(prev => [enhancedTransaction, ...prev]);
      }
      
      return newTransaction;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw new Error(err instanceof Error ? err.message : 'Error creating transaction');
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id: string, input: {
    type?: string;
    amount?: number;
    currency?: string;
    description?: string;
    transactionDate?: string;
  }) => {
    try {
      console.log('Updating transaction:', id, 'with input:', input);
      
      const { data } = await client.mutate({
        mutation: UPDATE_TRANSACTION,
        variables: { id, input },
        refetchQueries: [
          { query: GET_TRANSACTIONS_BY_USER_ID, variables: { userId: user?.id } }
        ],
        awaitRefetchQueries: true
      });
      
      console.log('Transaction updated successfully:', data);
      
      // Update local state immediately
      const updatedTransaction = (data as any)?.updateTransaction;
      if (updatedTransaction) {
        const enhancedTransaction = enhanceTransaction(updatedTransaction);
        setTransactions(prev => 
          prev.map(t => t.id === id ? enhancedTransaction : t)
        );
      }
      
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw new Error(err instanceof Error ? err.message : 'Error updating transaction');
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      console.log('Deleting transaction:', id);
      
      const { data } = await client.mutate({
        mutation: DELETE_TRANSACTION,
        variables: { id },
        refetchQueries: [
          { query: GET_TRANSACTIONS_BY_USER_ID, variables: { userId: user?.id } }
        ],
        awaitRefetchQueries: true
      });
      
      console.log('Transaction deleted successfully:', data);
      
      // Update local state immediately
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      return (data as any)?.deleteTransaction;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw new Error(err instanceof Error ? err.message : 'Error deleting transaction');
    }
  };

  // Update filters
  const updateFilters = (newFilters: TransactionFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Update pagination
  const updatePagination = (newPagination: Partial<PaginationOptions>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  // Get bank options for filtering (only banks with transactions)
  const getBankFilterOptions = useCallback(() => {
    const uniqueBanks = banks.filter(bank => 
      // Only include banks that have transactions
      transactions.some(transaction => transaction.bankId === bank.id)
    );
    
    return [
      { label: 'All Banks', value: 'all' },
      ...uniqueBanks.map(bank => ({
        label: bank.name || bank.id,
        value: bank.id
      }))
    ];
  }, [transactions, banks]);

  // Get all user banks for transaction creation
  const getAllUserBanks = useCallback(() => {
    return banks.map(bank => ({
      label: bank.name || bank.id,
      value: bank.id
    }));
  }, [banks]);

  // Initialize data loading
  useEffect(() => {
    if (user?.id) {
      fetchBanks();
    }
  }, [user, fetchBanks]);

  // Fetch transactions when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
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
    refetch: fetchTransactions
  };
};

export const getTransactionTypeOptions = () => [
  { label: 'All Types', value: 'all' },
  { label: 'Payment', value: 'Payment' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
  { label: 'Refund', value: 'Refund' },
  { label: 'Fee', value: 'Fee' },
];

export const getTransactionStatusOptions = () => [
  { label: 'All Status', value: 'all' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];

export const formatCurrency = (amount: number | undefined, currency = 'USD') => {
  if (amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatShortDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
