import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import client from '@/lib/apollo-client';
import { 
  GET_TRANSACTIONS_BY_USER_ID,
  GET_BANKS_BY_USER_ID 
} from '@/lib/transaction-graphql';
import { TransactionType, BankType } from '@/lib/types';

export interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
  monthlyData: MonthlyFinancialData[];
  categoryBreakdown: CategoryData[];
  merchantBreakdown: MerchantData[];
  trends: {
    incomeChange: number;
    expenseChange: number;
    savingsRate: number;
  };
}

export interface MonthlyFinancialData {
  month: string;
  year: number;
  totalSpent: number;
  totalIncome: number;
  netIncome: number;
  transactionCount: number;
  categories: Record<string, number>;
  merchants: Record<string, number>;
}

export interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
}

export interface MerchantData {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface FinancialFilters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  bankIds: string[];
  categories: string[];
  minAmount?: number;
  maxAmount?: number;
}

const CATEGORY_COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5A2B', '#EC4899', '#6366F1', '#84CC16', '#F97316'
];

export const useFinancialAnalysis = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [banks, setBanks] = useState<BankType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FinancialFilters>({
    dateRange: {
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
      endDate: new Date().toISOString().split('T')[0] // Today
    },
    bankIds: [],
    categories: []
  });

  // Fetch user transactions and banks
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [transactionsResult, banksResult] = await Promise.all([
        client.query({
          query: GET_TRANSACTIONS_BY_USER_ID,
          variables: { userId: user.id },
          fetchPolicy: 'network-only'
        }),
        client.query({
          query: GET_BANKS_BY_USER_ID,
          variables: { userId: user.id },
          fetchPolicy: 'network-only'
        })
      ]);
      
      setTransactions((transactionsResult.data as any)?.transactionsByUserId || []);
      setBanks((banksResult.data as any)?.banksByUserId || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading financial data');
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply date range filter
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      
      filtered = filtered.filter(transaction => {
        if (!transaction.transactionDate) return false;
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Apply bank filter
    if (filters.bankIds.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.bankIds.includes(transaction.bankId)
      );
    }

    // Apply category filter (using transaction type as category)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(transaction => 
        transaction.type && filters.categories.includes(transaction.type)
      );
    }

    // Apply amount range filter
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(transaction => 
        (transaction.amount || 0) >= filters.minAmount!
      );
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(transaction => 
        (transaction.amount || 0) <= filters.maxAmount!
      );
    }

    return filtered;
  }, [transactions, filters]);

  // Calculate financial analysis
  const financialData = useMemo((): FinancialData => {
    if (filteredTransactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        transactionCount: 0,
        averageTransaction: 0,
        monthlyData: [],
        categoryBreakdown: [],
        merchantBreakdown: [],
        trends: {
          incomeChange: 0,
          expenseChange: 0,
          savingsRate: 0
        }
      };
    }

    // Separate income and expenses
    const income = filteredTransactions.filter(t => (t.amount || 0) > 0);
    const expenses = filteredTransactions.filter(t => (t.amount || 0) < 0);

    const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + (t.amount || 0), 0));
    const netIncome = totalIncome - totalExpenses;

    // Group transactions by month
    const monthlyGroups = new Map<string, TransactionType[]>();
    filteredTransactions.forEach(transaction => {
      if (transaction.transactionDate) {
        const date = new Date(transaction.transactionDate);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyGroups.has(monthKey)) {
          monthlyGroups.set(monthKey, []);
        }
        monthlyGroups.get(monthKey)!.push(transaction);
      }
    });

    // Calculate monthly data
    const monthlyData: MonthlyFinancialData[] = Array.from(monthlyGroups.entries())
      .map(([monthKey, monthTransactions]) => {
        const [year, month] = monthKey.split('-').map(Number);
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        
        const monthIncome = monthTransactions
          .filter(t => (t.amount || 0) > 0)
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const monthExpenses = Math.abs(monthTransactions
          .filter(t => (t.amount || 0) < 0)
          .reduce((sum, t) => sum + (t.amount || 0), 0));

        // Group by category (transaction type)
        const categories: Record<string, number> = {};
        const merchants: Record<string, number> = {};

        monthTransactions.forEach(transaction => {
          if (transaction.amount && transaction.amount < 0) {
            // Categories (using transaction type)
            const category = transaction.type || 'Others';
            categories[category] = (categories[category] || 0) + Math.abs(transaction.amount);

            // Merchants (using description as merchant name)
            const merchant = transaction.description?.split(' ')[0] || 'Unknown';
            merchants[merchant] = (merchants[merchant] || 0) + Math.abs(transaction.amount);
          }
        });

        return {
          month: monthName,
          year,
          totalSpent: monthExpenses,
          totalIncome: monthIncome,
          netIncome: monthIncome - monthExpenses,
          transactionCount: monthTransactions.length,
          categories,
          merchants
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return new Date(`${b.month} 1, ${b.year}`).getMonth() - new Date(`${a.month} 1, ${a.year}`).getMonth();
      });

    // Calculate category breakdown
    const categoryTotals: Record<string, { amount: number; count: number }> = {};
    expenses.forEach(transaction => {
      const category = transaction.type || 'Others';
      if (!categoryTotals[category]) {
        categoryTotals[category] = { amount: 0, count: 0 };
      }
      categoryTotals[category].amount += Math.abs(transaction.amount || 0);
      categoryTotals[category].count += 1;
    });

    const categoryBreakdown: CategoryData[] = Object.entries(categoryTotals)
      .map(([name, data], index) => ({
        name,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate merchant breakdown (using first word of description)
    const merchantTotals: Record<string, { amount: number; count: number }> = {};
    expenses.forEach(transaction => {
      const merchant = transaction.description?.split(' ')[0] || 'Unknown';
      if (!merchantTotals[merchant]) {
        merchantTotals[merchant] = { amount: 0, count: 0 };
      }
      merchantTotals[merchant].amount += Math.abs(transaction.amount || 0);
      merchantTotals[merchant].count += 1;
    });

    const merchantBreakdown: MerchantData[] = Object.entries(merchantTotals)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 merchants

    // Calculate trends (compare with previous period)
    const currentMonthData = monthlyData[0];
    const previousMonthData = monthlyData[1];
    
    let incomeChange = 0;
    let expenseChange = 0;
    let savingsRate = 0;

    if (currentMonthData && previousMonthData) {
      incomeChange = previousMonthData.totalIncome > 0 
        ? ((currentMonthData.totalIncome - previousMonthData.totalIncome) / previousMonthData.totalIncome) * 100
        : 0;
      
      expenseChange = previousMonthData.totalSpent > 0
        ? ((currentMonthData.totalSpent - previousMonthData.totalSpent) / previousMonthData.totalSpent) * 100
        : 0;
    }

    if (totalIncome > 0) {
      savingsRate = (netIncome / totalIncome) * 100;
    }

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      transactionCount: filteredTransactions.length,
      averageTransaction: filteredTransactions.length > 0 
        ? Math.abs(totalIncome + totalExpenses) / filteredTransactions.length 
        : 0,
      monthlyData,
      categoryBreakdown,
      merchantBreakdown,
      trends: {
        incomeChange,
        expenseChange,
        savingsRate
      }
    };
  }, [filteredTransactions]);

  // Update filters
  const updateFilters = (newFilters: Partial<FinancialFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get available filter options
  const getFilterOptions = useMemo(() => {
    const bankOptions = banks.map(bank => ({
      label: bank.name || bank.id,
      value: bank.id
    }));

    const categoryOptions = [...new Set(transactions
      .map(t => t.type)
      .filter(Boolean))]
      .map(category => ({
        label: category!,
        value: category!
      }));

    return {
      banks: bankOptions,
      categories: categoryOptions
    };
  }, [banks, transactions]);

  // Initialize data loading
  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user, fetchData]);

  return {
    financialData,
    loading,
    error,
    filters,
    updateFilters,
    getFilterOptions,
    refetch: fetchData
  };
};
