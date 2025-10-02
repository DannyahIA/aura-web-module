"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { MonthlyFinancialData } from "@/hooks/use-financial-analysis"

interface EvolutionLineChartProps {
  data: MonthlyFinancialData[]
  showPrediction?: boolean
}

export function EvolutionLineChart({ data, showPrediction = false }: EvolutionLineChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Prepare chart data
  const chartData = data.map(month => ({
    period: `${month.month.slice(0, 3)} ${month.year}`,
    income: month.totalIncome,
    expenses: month.totalSpent,
    balance: month.netIncome,
    type: 'actual'
  }))

  // Add prediction for next month if enabled
  let predictionData = chartData
  if (showPrediction && data.length >= 2) {
    const lastMonth = data[0]
    const secondLastMonth = data[1]
    
    // Simple trend-based prediction
    const incomeGrowth = (lastMonth.totalIncome - secondLastMonth.totalIncome) / secondLastMonth.totalIncome
    const expenseGrowth = (lastMonth.totalSpent - secondLastMonth.totalSpent) / secondLastMonth.totalSpent
    
    const nextMonthIncome = lastMonth.totalIncome * (1 + incomeGrowth)
    const nextMonthExpenses = lastMonth.totalSpent * (1 + expenseGrowth)
    
    const nextMonth = new Date(lastMonth.year, new Date(`${lastMonth.month} 1, 2023`).getMonth() + 1)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    predictionData = [...chartData, {
      period: `${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`,
      income: nextMonthIncome,
      expenses: nextMonthExpenses,
      balance: nextMonthIncome - nextMonthExpenses,
      type: 'prediction'
    }]
  }

  // Calculate trends
  const latestBalance = data[0]?.netIncome || 0
  const previousBalance = data[1]?.netIncome || 0
  const balanceChange = latestBalance - previousBalance
  const balanceChangePercent = previousBalance !== 0 ? (balanceChange / Math.abs(previousBalance)) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evolução Financeira</CardTitle>
            <CardDescription>
              Receitas, despesas e saldo ao longo do tempo
              {showPrediction && " (com previsão)"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {balanceChange !== 0 && (
              <Badge variant={balanceChange > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                {balanceChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(balanceChangePercent).toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelFormatter={(label) => `Período: ${label}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            
            {/* Reference line at zero */}
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
            
            {/* Income line */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              name="Receita"
            />
            
            {/* Expenses line */}
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              name="Despesas"
            />
            
            {/* Balance line */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              name="Saldo"
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>Despesas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Saldo</span>
          </div>
          {showPrediction && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 border-t-2 border-dashed border-gray-400"></div>
              <span>Previsão</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
