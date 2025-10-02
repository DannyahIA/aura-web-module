"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { FinancialData } from "@/hooks/use-financial-analysis"

interface FinancialHealthRadarProps {
  data: FinancialData
  previousData?: FinancialData
}

interface RadarDataPoint {
  dimension: string
  currentScore: number
  previousScore?: number
  maxScore: number
}

export function FinancialHealthRadar({ data, previousData }: FinancialHealthRadarProps) {
  // Calculate scores for each dimension (0-100 scale)
  const calculateScores = (financialData: FinancialData) => {
    const totalIncome = financialData.totalIncome || 1 // Avoid division by zero
    
    // Savings rate (0-100, where 30%+ is excellent)
    const savingsRate = Math.min(100, Math.max(0, (financialData.trends.savingsRate / 30) * 100))
    
    // Expense control (inverse of expense growth, 0-100)
    const expenseControl = Math.min(100, Math.max(0, 100 - (financialData.trends.expenseChange * 2)))
    
    // Income stability (based on income growth, 0-100)
    const incomeStability = Math.min(100, Math.max(0, 50 + (financialData.trends.incomeChange * 2)))
    
    // Budget balance (based on net income ratio, 0-100)
    const budgetBalance = Math.min(100, Math.max(0, ((financialData.netIncome / totalIncome) + 1) * 50))
    
    // Transaction organization (based on number of categories, 0-100)
    const organization = Math.min(100, Math.max(0, (financialData.categoryBreakdown.length / 10) * 100))
    
    // Spending diversity (not too concentrated in one category, 0-100)
    const topCategoryPercentage = financialData.categoryBreakdown[0]?.percentage || 0
    const spendingDiversity = Math.min(100, Math.max(0, 100 - (topCategoryPercentage * 2)))

    return {
      savingsRate,
      expenseControl,
      incomeStability,
      budgetBalance,
      organization,
      spendingDiversity
    }
  }

  const currentScores = calculateScores(data)
  const previousScores = previousData ? calculateScores(previousData) : undefined

  const radarData: RadarDataPoint[] = [
    {
      dimension: 'Poupança',
      currentScore: currentScores.savingsRate,
      previousScore: previousScores?.savingsRate,
      maxScore: 100
    },
    {
      dimension: 'Controle de Gastos',
      currentScore: currentScores.expenseControl,
      previousScore: previousScores?.expenseControl,
      maxScore: 100
    },
    {
      dimension: 'Estabilidade de Renda',
      currentScore: currentScores.incomeStability,
      previousScore: previousScores?.incomeStability,
      maxScore: 100
    },
    {
      dimension: 'Equilíbrio Orçamentário',
      currentScore: currentScores.budgetBalance,
      previousScore: previousScores?.budgetBalance,
      maxScore: 100
    },
    {
      dimension: 'Organização',
      currentScore: currentScores.organization,
      previousScore: previousScores?.organization,
      maxScore: 100
    },
    {
      dimension: 'Diversificação',
      currentScore: currentScores.spendingDiversity,
      previousScore: previousScores?.spendingDiversity,
      maxScore: 100
    }
  ]

  // Calculate overall health score
  const overallScore = Math.round(
    radarData.reduce((sum, item) => sum + item.currentScore, 0) / radarData.length
  )

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { label: 'Excelente', color: 'text-green-600', variant: 'default' as const }
    if (score >= 60) return { label: 'Boa', color: 'text-blue-600', variant: 'secondary' as const }
    if (score >= 40) return { label: 'Regular', color: 'text-yellow-600', variant: 'outline' as const }
    return { label: 'Precisa Melhorar', color: 'text-red-600', variant: 'destructive' as const }
  }

  const healthLevel = getHealthLevel(overallScore)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RadarDataPoint
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span>Atual:</span>
              <span className="font-bold">{data.currentScore.toFixed(0)}/100</span>
            </div>
            {data.previousScore !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span>Anterior:</span>
                <span className="font-medium text-muted-foreground">
                  {data.previousScore.toFixed(0)}/100
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Radar de Saúde Financeira</CardTitle>
            <CardDescription>
              Análise multidimensional do seu perfil financeiro
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={healthLevel.variant} className={healthLevel.color}>
              {overallScore}/100 - {healthLevel.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Radar Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid className="opacity-30" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickCount={6}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Current period */}
              <Radar
                name="Atual"
                dataKey="currentScore"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              
              {/* Previous period (if available) */}
              {previousScores && (
                <Radar
                  name="Anterior"
                  dataKey="previousScore"
                  stroke="#94a3b8"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 gap-4">
            {radarData.map((item) => {
              const change = item.previousScore !== undefined 
                ? item.currentScore - item.previousScore 
                : 0
              
              return (
                <div key={item.dimension} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.dimension}</span>
                    <span className="text-lg font-bold">{item.currentScore.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.currentScore}%` }}
                    />
                  </div>
                  {item.previousScore !== undefined && (
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Anterior: {item.previousScore.toFixed(0)}
                      </span>
                      <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {change >= 0 ? '+' : ''}{change.toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">🎯 Recomendações</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {overallScore < 60 && (
                <>
                  <p>• Foque em melhorar sua taxa de poupança criando um orçamento mais rigoroso</p>
                  <p>• Considere revisar seus gastos recorrentes para identificar cortes possíveis</p>
                </>
              )}
              {currentScores.savingsRate < 50 && (
                <p>• Meta: Economize pelo menos 20% da sua renda mensal</p>
              )}
              {currentScores.expenseControl < 50 && (
                <p>• Monitore mais de perto o crescimento dos seus gastos</p>
              )}
              {currentScores.spendingDiversity < 50 && (
                <p>• Diversifique seus gastos para não concentrar muito em uma categoria</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
