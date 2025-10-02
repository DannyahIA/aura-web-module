import { useState, useEffect } from 'react';

interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  type: 'savings' | 'expense_reduction' | 'income_increase'
}

export function useFinancialGoals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading goals
    setLoading(true);
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          title: 'Emergência - 6 meses',
          targetAmount: 15000,
          currentAmount: 8500,
          deadline: '2025-12-31',
          category: 'Emergency Fund',
          type: 'savings'
        },
        {
          id: '2',
          title: 'Viagem para Europa',
          targetAmount: 5000,
          currentAmount: 2200,
          deadline: '2025-06-15',
          category: 'Travel',
          type: 'savings'
        },
        {
          id: '3',
          title: 'Reduzir gastos com delivery',
          targetAmount: 200, // Reduction target per month
          currentAmount: 150, // Current reduction achieved
          deadline: '2025-03-31',
          category: 'Food',
          type: 'expense_reduction'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addGoal = async (goal: Omit<FinancialGoal, 'id'>) => {
    // TODO: Implement API call
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = async (goalId: string, updates: Partial<FinancialGoal>) => {
    // TODO: Implement API call
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = async (goalId: string) => {
    // TODO: Implement API call
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal
  };
}
