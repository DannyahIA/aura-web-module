"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MonthlyFinancialData } from "@/hooks/use-financial-analysis"

interface SpendingChartProps {
  data: MonthlyFinancialData[]
}

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    month: `${item.month.slice(0, 3)} ${item.year}`,
    expenses: item.totalSpent,
    income: item.totalIncome,
    savings: item.netIncome,
  })).reverse() // Show oldest to newest

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Evolution</CardTitle>
          <CardDescription>Comparison of income, expenses, and savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Evolution</CardTitle>
        <CardDescription>Comparison of income, expenses, and savings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            <Bar dataKey="savings" fill="#3b82f6" name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
