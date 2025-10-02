"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MonthlyFinancialData } from "@/hooks/use-financial-analysis"

interface StackedAreaChartProps {
  data: MonthlyFinancialData[]
}

// Predefined colors for categories
const CATEGORY_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
  "#14b8a6", // teal
  "#f43f5e", // rose
]

export function StackedAreaChart({ data }: StackedAreaChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get all unique categories across all months
  const allCategories = Array.from(
    new Set(
      data.flatMap(month => Object.keys(month.categories))
    )
  ).filter(category => category !== '') // Remove empty categories

  // Assign colors to categories
  const categoryColors: Record<string, string> = {}
  allCategories.forEach((category, index) => {
    categoryColors[category] = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  })

  // Prepare chart data
  const chartData = data.map(month => {
    const monthData: any = {
      period: `${month.month.slice(0, 3)} ${month.year}`,
      total: month.totalSpent
    }
    
    // Add each category as a separate field
    allCategories.forEach(category => {
      monthData[category] = month.categories[category] || 0
    })
    
    return monthData
  }).reverse() // Show chronological order

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + (item.value || 0), 0)
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
            {payload
              .filter((item: any) => item.value > 0)
              .sort((a: any, b: any) => b.value - a.value)
              .map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="truncate">{item.dataKey}:</span>
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            <div className="border-t pt-1 mt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{formatCurrency(total)}</span>
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
        <CardTitle>Evolução de Gastos por Categoria</CardTitle>
        <CardDescription>
          Como cada categoria contribui para o gasto total ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
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
            <Tooltip content={<CustomTooltip />} />
            
            {/* Render areas for each category */}
            {allCategories.map((category, index) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={categoryColors[category]}
                fill={categoryColors[category]}
                fillOpacity={0.8}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Category Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
          {allCategories.map((category) => (
            <div key={category} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: categoryColors[category] }}
              ></div>
              <span className="truncate" title={category}>{category}</span>
            </div>
          ))}
        </div>
        
        {/* Insights */}
        {allCategories.length > 0 && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Insights</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Acompanhe o crescimento ou redução de gastos em cada categoria</p>
              <p>• Identifique padrões sazonais nos seus gastos</p>
              <p>• Veja qual categoria tem maior impacto no orçamento total</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
