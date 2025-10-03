import { useState, useEffect, useCallback } from 'react';
import client from '@/lib/apollo-client';
import { useAuth } from '@/contexts/auth-context';
import {
  GET_TRANSACTIONS_BY_USER_ID,
  GET_BANKS_BY_USER_ID
} from '@/lib/graphql-queries';
import { TransactionType, BankType, BankAccountType } from '@/lib/types';

interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyChange: number;
  accountsCount: number;
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  bankName?: string;
}

export const useRealFinancialData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Financial data states
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    monthlyChange: 0,
    accountsCount: 0
  });
  
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);

  // Category colors for consistent visualization
  const categoryColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];

  const fetchFinancialData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch banks and transactions in parallel
      const [banksResponse, transactionsResponse] = await Promise.all([
        client.query({
          query: GET_BANKS_BY_USER_ID,
          variables: { userId: user.id },
          fetchPolicy: 'network-only'
        }),
        client.query({
          query: GET_TRANSACTIONS_BY_USER_ID,
          variables: { userId: user.id },
          fetchPolicy: 'network-only'
        })
      ]);

      const banksData = (banksResponse.data as any)?.banksByUserId || [];
      const transactionsData = (transactionsResponse.data as any)?.transactionsByUserId || [];

      setBanks(banksData);
      
      // Process financial summary
      const processedSummary = processSummaryData(banksData, transactionsData);
      setSummary(processedSummary);

      // Process category data
      const processedCategories = processCategoryData(transactionsData);
      setCategoryData(processedCategories);

      // Process monthly data
      const processedMonthly = processMonthlyData(transactionsData);
      setMonthlyData(processedMonthly);

      // Process recent transactions
      const processedRecent = processRecentTransactions(transactionsData, banksData);
      setRecentTransactions(processedRecent);

    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const processSummaryData = (banks: BankType[], transactions: TransactionType[]): FinancialSummary => {
    // For now, calculate balance from recent transactions since BankType doesn't have balance
    // In a real app, you'd fetch bank accounts with balances
    const totalBalance = transactions
      .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    
    // Get current month transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate || '');
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate income and expenses for current month
    const totalIncome = currentMonthTransactions
      .filter(t => (t.amount || 0) > 0)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalExpenses = Math.abs(currentMonthTransactions
      .filter(t => (t.amount || 0) < 0)
      .reduce((sum, t) => sum + (t.amount || 0), 0));
    
    const netIncome = totalIncome - totalExpenses;
    
    // Calculate monthly change (compare with previous month)
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previousMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate || '');
      return transactionDate.getMonth() === previousMonth && 
             transactionDate.getFullYear() === previousYear;
    });
    
    const previousNetIncome = previousMonthTransactions
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const monthlyChange = previousNetIncome !== 0 
      ? ((netIncome - previousNetIncome) / Math.abs(previousNetIncome)) * 100 
      : 0;
    
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netIncome,
      monthlyChange,
      accountsCount: banks.length
    };
  };

  const processCategoryData = (transactions: TransactionType[]): CategoryData[] => {
    // Get current month expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const expenseTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate || '');
      return (t.amount || 0) < 0 &&
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Group by category (using description patterns as categories)
    const categoryGroups = expenseTransactions.reduce((acc, transaction) => {
      const category = categorizeTransaction(transaction.description || 'Other');
      const amount = Math.abs(transaction.amount || 0);
      
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    const totalExpenses = Object.values(categoryGroups).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryGroups)
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: categoryColors[index % categoryColors.length]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 categories
  };

  const processMonthlyData = (transactions: TransactionType[]): MonthlyData[] => {
    const monthlyGroups: Record<string, { income: number; expenses: number }> = {};
    
    // Get last 6 months of data
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyGroups[monthKey] = { income: 0, expenses: 0 };
    }
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.transactionDate || '');
      const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyGroups[monthKey]) {
        const amount = transaction.amount || 0;
        if (amount > 0) {
          monthlyGroups[monthKey].income += amount;
        } else {
          monthlyGroups[monthKey].expenses += Math.abs(amount);
        }
      }
    });
    
    return Object.entries(monthlyGroups).map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses
      };
    });
  };

  const processRecentTransactions = (transactions: TransactionType[], banks: BankType[]): RecentTransaction[] => {
    return [...transactions] // Create a copy to avoid mutating readonly array
      .sort((a, b) => new Date(b.transactionDate || '').getTime() - new Date(a.transactionDate || '').getTime())
      .slice(0, 5)
      .map(transaction => {
        const bank = banks.find(b => b.id === transaction.bankId);
        return {
          id: transaction.id || '',
          description: transaction.description || 'No description',
          amount: transaction.amount || 0,
          type: transaction.type || 'Unknown',
          date: transaction.transactionDate || '',
          bankName: bank?.name
        };
      });
  };

  const categorizeTransaction = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('uber') || desc.includes('taxi') || desc.includes('transport')) return 'Transport';
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('delivery')) return 'Food & Dining';
    if (desc.includes('grocery') || desc.includes('supermarket') || desc.includes('market')) return 'Groceries';
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('entertainment')) return 'Entertainment';
    if (desc.includes('gas') || desc.includes('fuel') || desc.includes('station')) return 'Gas & Fuel';
    if (desc.includes('shop') || desc.includes('store') || desc.includes('retail')) return 'Shopping';
    if (desc.includes('health') || desc.includes('medical') || desc.includes('pharmacy')) return 'Healthcare';
    if (desc.includes('rent') || desc.includes('utilities') || desc.includes('electric')) return 'Bills & Utilities';
    
    return 'Other';
  };

  // Fetch data on component mount and user change
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    // Data
    summary,
    categoryData,
    monthlyData,
    recentTransactions,
    banks,
    
    // States
    loading,
    error,
    
    // Functions
    refetch: fetchFinancialData,
  };
};
