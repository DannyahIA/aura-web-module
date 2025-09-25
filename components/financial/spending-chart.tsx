"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MonthlyData {
  month: string
  year: number
  totalSpent: number
  totalIncome: number
  categories: Record<string, number>
  merchants: Record<string, number>
}

interface SpendingChartProps {
  data: MonthlyData[]
}

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    expenses: item.totalSpent,
    income: item.totalIncome,
    savings: item.totalIncome - item.totalSpent,
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">Monthly Evolution</CardTitle>
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
