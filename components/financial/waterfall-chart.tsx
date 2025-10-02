"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { MonthlyFinancialData } from "@/hooks/use-financial-analysis"

interface WaterfallChartProps {
  monthData: MonthlyFinancialData
}

interface WaterfallDataPoint {
  name: string
  value: number
  cumulative: number
  type: 'income' | 'expense' | 'balance'
  color: string
}

export function WaterfallChart({ monthData }: WaterfallChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Prepare waterfall data
  const waterfallData: WaterfallDataPoint[] = []
  let cumulative = 0

  // Starting point
  waterfallData.push({
    name: 'Saldo Inicial',
    value: 0,
    cumulative: 0,
    type: 'balance',
    color: '#6b7280'
  })

  // Add income
  if (monthData.totalIncome > 0) {
    cumulative += monthData.totalIncome
    waterfallData.push({
      name: 'Receitas',
      value: monthData.totalIncome,
      cumulative,
      type: 'income',
      color: '#10b981'
    })
  }

  // Add expenses by category (top categories only)
  const sortedCategories = Object.entries(monthData.categories)
    .filter(([_, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6) // Show top 6 categories

  sortedCategories.forEach(([category, amount]) => {
    cumulative -= amount
    waterfallData.push({
      name: category,
      value: -amount,
      cumulative,
      type: 'expense',
      color: '#ef4444'
    })
  })

  // If there are more categories, group them as "Outros"
  const remainingCategories = Object.entries(monthData.categories)
    .filter(([_, amount]) => amount > 0)
    .slice(6)

  if (remainingCategories.length > 0) {
    const otherAmount = remainingCategories.reduce((sum, [, amount]) => sum + amount, 0)
    cumulative -= otherAmount
    waterfallData.push({
      name: 'Outros',
      value: -otherAmount,
      cumulative,
      type: 'expense',
      color: '#f97316'
    })
  }

  // Final balance
  waterfallData.push({
    name: 'Saldo Final',
    value: monthData.netIncome,
    cumulative,
    type: 'balance',
    color: monthData.netIncome >= 0 ? '#10b981' : '#ef4444'
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as WaterfallDataPoint
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            {data.type !== 'balance' && (
              <div className="flex items-center justify-between gap-4">
                <span>Valor:</span>
                <span className={`font-medium ${data.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(data.value))}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <span>Saldo Acumulado:</span>
              <span className={`font-bold ${data.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(data.cumulative)}
              </span>
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
        <CardTitle>Análise em Cascata - {monthData.month} {monthData.year}</CardTitle>
        <CardDescription>
          Como o saldo do mês foi formado: receitas e principais categorias de gastos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar dataKey="cumulative" radius={[4, 4, 4, 4]}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(monthData.totalIncome)}
            </div>
            <div className="text-sm text-muted-foreground">Total de Receitas</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(monthData.totalSpent)}
            </div>
            <div className="text-sm text-muted-foreground">Total de Despesas</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${monthData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthData.netIncome)}
            </div>
            <div className="text-sm text-muted-foreground">Saldo Final</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span>Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span>Despesas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-orange-500 rounded"></div>
            <span>Outros Gastos</span>
          </div>
        </div>
        
        {/* Insights */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">💡 Insights</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Identifique rapidamente as categorias que mais impactam seu orçamento</p>
            <p>• Veja o fluxo completo do seu dinheiro durante o mês</p>
            <p>• Concentre esforços de economia nas categorias de maior impacto</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
