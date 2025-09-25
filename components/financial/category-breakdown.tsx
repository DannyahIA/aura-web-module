"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface MonthlyData {
  month: string
  year: number
  totalSpent: number
  totalIncome: number
  categories: Record<string, number>
  merchants: Record<string, number>
}

interface CategoryBreakdownProps {
  data: MonthlyData
}

const COLORS = ["#164e63", "#d97706", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b", "#06b6d4"]

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = Object.entries(data.categories).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / data.totalSpent) * 100).toFixed(1),
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Spending by Category</CardTitle>
          <CardDescription>Distribution of your monthly spending</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Category Breakdown</CardTitle>
          <CardDescription>Detailed values and percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chartData
              .sort((a, b) => b.value - a.value)
              .map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.value)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
