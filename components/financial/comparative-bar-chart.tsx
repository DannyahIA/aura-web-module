"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { MonthlyFinancialData } from "@/hooks/use-financial-analysis"

interface ComparativeBarChartProps {
  data: MonthlyFinancialData[]
}

export function ComparativeBarChart({ data }: ComparativeBarChartProps) {
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
    expenses: -month.totalSpent, // Negative for visual comparison
    balance: month.netIncome,
    positiveMonth: month.netIncome > 0
  })).reverse() // Show chronological order

  // Calculate statistics
  const positiveMonths = chartData.filter(month => month.positiveMonth).length
  const totalMonths = chartData.length
  const positivePercentage = totalMonths > 0 ? (positiveMonths / totalMonths) * 100 : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0
      const expenses = Math.abs(payload.find((p: any) => p.dataKey === 'expenses')?.value || 0)
      const balance = income - expenses
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Receita:</span>
              </div>
              <span className="font-medium text-green-600">{formatCurrency(income)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Despesas:</span>
              </div>
              <span className="font-medium text-red-600">{formatCurrency(expenses)}</span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Saldo:</span>
                <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>
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
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>
              Comparação mensal para identificar períodos positivos e negativos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={positivePercentage >= 70 ? "default" : positivePercentage >= 40 ? "secondary" : "destructive"}>
              {positiveMonths}/{totalMonths} meses positivos
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(Math.abs(value))}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line at zero */}
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
            
            {/* Income bars */}
            <Bar
              dataKey="income"
              fill="#10b981"
              name="Receita"
              radius={[2, 2, 0, 0]}
            />
            
            {/* Expense bars */}
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              name="Despesas"
              radius={[0, 0, 2, 2]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{positiveMonths}</div>
            <div className="text-sm text-muted-foreground">Meses Positivos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalMonths - positiveMonths}</div>
            <div className="text-sm text-muted-foreground">Meses Negativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{positivePercentage.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span>Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span>Despesas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
