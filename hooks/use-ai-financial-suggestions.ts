import { useState, useEffect } from 'react';
import client from '@/lib/apollo-client';
import { useAuth } from '@/contexts/auth-context';
import { 
  GET_AI_FINANCIAL_SUGGESTIONS,
  GET_FINANCIAL_PREDICTIONS,
  UPDATE_AI_SUGGESTION_STATUS 
} from '@/lib/ai-financial-graphql';

export interface AISuggestion {
  id: string;
  type: 'expense_reduction' | 'income_optimization' | 'saving_strategy';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: string;
  impact: {
    monthlySavings: number;
    yearlyProjection: number;
    reductionPercentage: number;
  };
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeToImplement: number;
    steps: string[];
  };
  visualization: {
    chartType: 'line' | 'bar' | 'comparison';
    beforeData: any[];
    afterData: any[];
    projectionPeriod: number;
  };
  confidence: number;
  reasoning: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'implemented';
}

export interface FinancialPrediction {
  baselineScenario: {
    name: string;
    description: string;
    monthlyProjections: Array<{
      month: string;
      income: number;
      expenses: number;
      netIncome: number;
      categories: Array<{
        name: string;
        amount: number;
      }>;
    }>;
  };
  optimizedScenario: {
    name: string;
    description: string;
    appliedSuggestions: string[];
    monthlyProjections: Array<{
      month: string;
      income: number;
      expenses: number;
      netIncome: number;
      categories: Array<{
        name: string;
        amount: number;
        savings: number;
      }>;
    }>;
    totalSavings: number;
    improvementPercentage: number;
  };
  confidence: number;
}

export function useAIFinancialSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [predictions, setPredictions] = useState<FinancialPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState(6);

  // Carregar sugestões
  const fetchSuggestions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_AI_FINANCIAL_SUGGESTIONS,
        variables: { userId: user.id },
        fetchPolicy: 'cache-and-network'
      });
      
      setSuggestions(data.aiFinancialSuggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Carregar predições
  const fetchPredictions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_FINANCIAL_PREDICTIONS,
        variables: { 
          userId: user.id,
          timeframe 
        },
        fetchPolicy: 'cache-and-network'
      });
      
      setPredictions(data.financialPredictions || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching predictions');
    } finally {
      setLoading(false);
    }
  };

  // Aceitar sugestão
  const acceptSuggestion = async (suggestionId: string, feedback?: string) => {
    try {
      await client.mutate({
        mutation: UPDATE_AI_SUGGESTION_STATUS,
        variables: {
          suggestionId,
          status: 'accepted',
          userFeedback: feedback
        }
      });
      await fetchSuggestions();
      await fetchPredictions();
    } catch (error) {
      console.error('Error accepting suggestion:', error);
    }
  };

  // Rejeitar sugestão
  const rejectSuggestion = async (suggestionId: string, feedback?: string) => {
    try {
      await client.mutate({
        mutation: UPDATE_AI_SUGGESTION_STATUS,
        variables: {
          suggestionId,
          status: 'rejected',
          userFeedback: feedback
        }
      });
      await fetchSuggestions();
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    }
  };

  // Marcar como implementada
  const implementSuggestion = async (suggestionId: string) => {
    try {
      await client.mutate({
        mutation: UPDATE_AI_SUGGESTION_STATUS,
        variables: {
          suggestionId,
          status: 'implemented'
        }
      });
      await fetchSuggestions();
      await fetchPredictions();
    } catch (error) {
      console.error('Error implementing suggestion:', error);
    }
  };

  // Atualizar timeframe
  const updateTimeframe = (months: number) => {
    setTimeframe(months);
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      fetchSuggestions();
      fetchPredictions();
    }
  }, [user?.id, timeframe]);

  // Calcular métricas
  const totalPotentialSavings = suggestions
    .filter(s => s.status === 'accepted' || s.status === 'pending')
    .reduce((sum, s) => sum + s.impact.monthlySavings, 0);

  const suggestionsByCategory = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, AISuggestion[]>);

  const suggestionsByPriority = {
    high: suggestions.filter(s => s.priority === 'high'),
    medium: suggestions.filter(s => s.priority === 'medium'),
    low: suggestions.filter(s => s.priority === 'low'),
  };

  return {
    // Dados
    suggestions,
    predictions,
    suggestionsByCategory,
    suggestionsByPriority,
    totalPotentialSavings,
    
    // Estados
    loading,
    error,
    timeframe,
    
    // Ações
    acceptSuggestion,
    rejectSuggestion,
    implementSuggestion,
    updateTimeframe,
    refetchSuggestions: fetchSuggestions,
    refetchPredictions: fetchPredictions,
  };
}
