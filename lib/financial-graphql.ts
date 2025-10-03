import { gql } from '@apollo/client';

// Query para dados de análise financeira processados pelo backend Python
export const GET_FINANCIAL_ANALYSIS = gql`
  query GetFinancialAnalysis($userId: ID!, $filters: FinancialFiltersInput) {
    financialAnalysis(userId: $userId, filters: $filters) {
      overview {
        totalIncome
        totalExpenses
        netIncome
        savingsRate
        transactionCount
        averageTransaction
      }
      
      trends {
        incomeChange
        expenseChange
        savingsRateChange
        prediction {
          nextMonthIncome
          nextMonthExpenses
          confidence
          model
        }
      }
      
      monthlyData {
        month
        year
        totalIncome
        totalExpenses
        netIncome
        transactionCount
        categories {
          name
          amount
          percentage
          trend
        }
        merchants {
          name
          amount
          percentage
          frequency
        }
        predictions {
          income
          expenses
          confidence
        }
      }
      
      categoryAnalysis {
        categories {
          name
          amount
          percentage
          transactionCount
          trend
          seasonality
          color
          predictions {
            nextMonth
            confidence
          }
        }
        insights {
          topGrowingCategory
          topDecreasingCategory
          unusualSpending
          recommendations
        }
      }
      
      merchantAnalysis {
        merchants {
          name
          amount
          percentage
          transactionCount
          frequency
          avgTransactionAmount
          trend
          loyalty
        }
        insights {
          newMerchants
          lostMerchants
          loyaltyScore
        }
      }
      
      spendingPatterns {
        dailyPatterns {
          dayOfWeek
          averageAmount
          transactionCount
          peakHours
        }
        weeklyPatterns {
          week
          totalAmount
          categories
        }
        seasonalPatterns {
          season
          multiplier
          categories
        }
        timeBasedInsights {
          peakSpendingDay
          peakSpendingHour
          quietestDay
          patterns
        }
      }
      
      healthScore {
        overall
        dimensions {
          savings
          expenseControl
          incomeStability
          budgetBalance
          diversification
          organization
        }
        recommendations
        comparison {
          percentile
          benchmark
        }
      }
      
      anomalies {
        transactions {
          id
          amount
          description
          date
          anomalyScore
          reasons
        }
        patterns {
          type
          description
          severity
          recommendations
        }
      }
      
      forecasting {
        income {
          nextMonth
          next3Months
          next6Months
          confidence
          scenarios {
            optimistic
            realistic
            pessimistic
          }
        }
        expenses {
          nextMonth
          next3Months
          next6Months
          confidence
          byCategory {
            category
            prediction
            confidence
          }
        }
        cashFlow {
          predictions
          riskAnalysis
          recommendations
        }
      }
    }
  }
`;

// Query para dados de objetivos financeiros
export const GET_FINANCIAL_GOALS = gql`
  query GetFinancialGoals($userId: ID!) {
    financialGoals(userId: $userId) {
      id
      title
      description
      targetAmount
      currentAmount
      deadline
      category
      type
      status
      createdAt
      updatedAt
      progress {
        percentage
        monthlyRequired
        onTrack
        projectedCompletion
      }
      insights {
        feasibility
        recommendations
        milestones
      }
    }
  }
`;

// Mutation para criar objetivo
export const CREATE_FINANCIAL_GOAL = gql`
  mutation CreateFinancialGoal($input: CreateFinancialGoalInput!) {
    createFinancialGoal(input: $input) {
      id
      title
      targetAmount
      deadline
      progress {
        percentage
        onTrack
      }
    }
  }
`;

// Query para heatmap de gastos (dados processados)
export const GET_SPENDING_HEATMAP = gql`
  query GetSpendingHeatmap($userId: ID!, $period: String!) {
    spendingHeatmap(userId: $userId, period: $period) {
      data {
        day
        hour
        amount
        transactionCount
        intensity
        categories
      }
      insights {
        peakDay
        peakHour
        patterns
        recommendations
      }
      statistics {
        totalAmount
        avgDailySpending
        peakSpendingMultiplier
      }
    }
  }
`;

// Query para predições avançadas
export const GET_AI_PREDICTIONS = gql`
  query GetAIPredictions($userId: ID!, $horizon: String!) {
    aiPredictions(userId: $userId, horizon: $horizon) {
      income {
        predictions
        confidence
        model
        features
      }
      expenses {
        predictions
        confidence
        byCategory {
          category
          prediction
          factors
        }
      }
      scenarios {
        optimistic {
          income
          expenses
          probability
        }
        realistic {
          income
          expenses
          probability
        }
        pessimistic {
          income
          expenses
          probability
        }
      }
      recommendations {
        savings
        investments
        budgetAdjustments
        riskMitigation
      }
      modelInfo {
        accuracy
        lastTrained
        features
        algorithm
      }
    }
  }
`;

// Tipos TypeScript para as respostas
export interface FinancialAnalysisResponse {
  financialAnalysis: {
    overview: OverviewData;
    trends: TrendsData;
    monthlyData: MonthlyDataPoint[];
    categoryAnalysis: CategoryAnalysisData;
    merchantAnalysis: MerchantAnalysisData;
    spendingPatterns: SpendingPatternsData;
    healthScore: HealthScoreData;
    anomalies: AnomaliesData;
    forecasting: ForecastingData;
  };
}

export interface OverviewData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface TrendsData {
  incomeChange: number;
  expenseChange: number;
  savingsRateChange: number;
  prediction: {
    nextMonthIncome: number;
    nextMonthExpenses: number;
    confidence: number;
    model: string;
  };
}

export interface MonthlyDataPoint {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  categories: CategoryData[];
  merchants: MerchantData[];
  predictions: {
    income: number;
    expenses: number;
    confidence: number;
  };
}

export interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  trend: number;
  seasonality: number;
  color: string;
  predictions: {
    nextMonth: number;
    confidence: number;
  };
}

export interface AIPrediction {
  income: {
    predictions: number[];
    confidence: number[];
    model: string;
    features: string[];
  };
  expenses: {
    predictions: number[];
    confidence: number[];
    byCategory: {
      category: string;
      prediction: number[];
      factors: string[];
    }[];
  };
  scenarios: {
    optimistic: { income: number; expenses: number; probability: number };
    realistic: { income: number; expenses: number; probability: number };
    pessimistic: { income: number; expenses: number; probability: number };
  };
  recommendations: {
    savings: string[];
    investments: string[];
    budgetAdjustments: string[];
    riskMitigation: string[];
  };
  modelInfo: {
    accuracy: number;
    lastTrained: string;
    features: string[];
    algorithm: string;
  };
}
