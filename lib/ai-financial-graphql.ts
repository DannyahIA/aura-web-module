import { gql } from '@apollo/client';

// Query para obter análises financeiras com IA
export const GET_FINANCIAL_ANALYSIS_WITH_AI = gql`
  query GetFinancialAnalysisWithAI($userId: ID!, $period: String!) {
    financialAnalysisWithAI(userId: $userId, period: $period) {
      # Dados atuais
      currentData {
        totalIncome
        totalExpenses
        netIncome
        monthlyData {
          month
          year
          totalSpent
          totalIncome
          netIncome
          categories {
            name
            amount
            percentage
          }
        }
      }
      
      # Sugestões da IA (já processadas no backend)
      aiSuggestions {
        id
        type # "expense_reduction", "income_optimization", "saving_strategy"
        category
        title
        description
        confidence # 0-100
        impact {
          currentAmount
          suggestedAmount
          reduction
          reductionPercentage
        }
        timeframe # "daily", "weekly", "monthly"
        reasoning # Explicação da IA
        actionSteps
      }
      
      # Predições com as sugestões aplicadas
      predictions {
        scenario # "current", "with_ai_suggestions"
        monthlyForecasts {
          month
          year
          predictedIncome
          predictedExpenses
          predictedNetIncome
          categories {
            name
            currentAmount
            predictedAmount
            change
          }
          confidence
        }
      }
      
      # Análises comportamentais
      behaviorAnalysis {
        spendingPatterns {
          dayOfWeek
          hourOfDay
          averageAmount
          frequency
        }
        categories {
          name
          trend # "increasing", "decreasing", "stable"
          seasonality
          anomalies {
            date
            amount
            reason
          }
        }
      }
    }
  }
`;

// Query para sugestões específicas de IA
export const GET_AI_FINANCIAL_SUGGESTIONS = gql`
  query GetAIFinancialSuggestions($userId: ID!) {
    aiFinancialSuggestions(userId: $userId) {
      id
      type
      priority # "high", "medium", "low"
      title
      description
      category
      impact {
        monthlySavings
        yearlyProjection
        reductionPercentage
      }
      implementation {
        difficulty # "easy", "medium", "hard"
        timeToImplement # em dias
        steps
      }
      visualization {
        chartType # "line", "bar", "comparison"
        beforeData
        afterData
        projectionPeriod
      }
      confidence
      reasoning
      lastUpdated
    }
  }
`;

// Mutation para aceitar/rejeitar sugestões
export const UPDATE_AI_SUGGESTION_STATUS = gql`
  mutation UpdateAISuggestionStatus($suggestionId: ID!, $status: String!, $userFeedback: String) {
    updateAISuggestionStatus(suggestionId: $suggestionId, status: $status, userFeedback: $userFeedback) {
      id
      status
      implementedAt
      userFeedback
    }
  }
`;

// Query para obter predições comparativas
export const GET_FINANCIAL_PREDICTIONS = gql`
  query GetFinancialPredictions($userId: ID!, $timeframe: Int!) {
    financialPredictions(userId: $userId, timeframe: $timeframe) {
      baselineScenario {
        name
        description
        monthlyProjections {
          month
          income
          expenses
          netIncome
          categories {
            name
            amount
          }
        }
      }
      
      optimizedScenario {
        name
        description
        appliedSuggestions
        monthlyProjections {
          month
          income
          expenses
          netIncome
          categories {
            name
            amount
            savings
          }
        }
        totalSavings
        improvementPercentage
      }
      
      confidence
      lastGenerated
    }
  }
`;
