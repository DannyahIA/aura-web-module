"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { CategoryData, MerchantData } from "@/hooks/use-financial-analysis"

interface CategoryBreakdownProps {
  categories: CategoryData[]
  merchants: MerchantData[]
}

export function CategoryBreakdown({ categories, merchants }: CategoryBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const categoryChartData = categories.slice(0, 8).map(category => ({
    name: category.name,
    value: category.amount,
    percentage: category.percentage.toFixed(1),
  }))

  const merchantChartData = merchants.slice(0, 10).map(merchant => ({
    name: merchant.name,
    amount: merchant.amount,
    percentage: merchant.percentage.toFixed(1),
  }))

  if (categories.length === 0 && merchants.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Distribution of your spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
              No category data available
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
            <CardDescription>Your most frequent spending destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
              No merchant data available
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Categories Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Distribution of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categories[index]?.color || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Category List */}
              <div className="mt-4 space-y-2">
                {categories.slice(0, 5).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(category.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.percentage.toFixed(1)}% • {category.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Merchants */}
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
          <CardDescription>Your most frequent spending destinations</CardDescription>
        </CardHeader>
        <CardContent>
          {merchants.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={merchantChartData}
                  layout="horizontal"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Merchant List */}
              <div className="mt-4 space-y-2">
                {merchants.slice(0, 5).map((merchant, index) => (
                  <div key={merchant.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{merchant.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(merchant.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {merchant.percentage.toFixed(1)}% • {merchant.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
              No merchant data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
