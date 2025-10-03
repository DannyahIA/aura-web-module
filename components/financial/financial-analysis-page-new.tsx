"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FinancialFilters } from "@/components/financial/financial-filters"
import { SpendingChart } from "@/components/financial/spending-chart"
import { CategoryBreakdown } from "@/components/financial/category-breakdown"
import { MonthlyComparison } from "@/components/financial/monthly-comparison"
import { EmptyAnalytics } from "@/components/ui/empty-states"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
} from "lucide-react"
import { usePageConfig } from "@/hooks/use-page-config"
import { useFinancialAnalysis } from "@/hooks/use-financial-analysis"

export function FinancialAnalysisPage() {
  const { 
    financialData, 
    loading, 
    error, 
    filters, 
    updateFilters,
    getFilterOptions,
    refetch 
  } = useFinancialAnalysis();
  
  const [activeView, setActiveView] = useState<"overview" | "spending" | "categories" | "comparison">("overview")
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  usePageConfig({
    title: "Financial Analysis",
    description: "Analyze your spending patterns and financial health",
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  // Loading state
  if (loading) {
    return (
      <div className="container px-4 py-6 md:px-6">
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container px-4 py-6 md:px-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-background p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Error loading financial data</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (financialData.transactionCount === 0) {
    return (
      <div className="container px-4 py-6 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and financial health
            </p>
          </div>
        </div>
        
        <EmptyAnalytics 
          title="No financial data available"
          description="Start by adding some transactions to see your financial analysis."
          actionLabel="Add Transaction"
          onAction={() => window.location.href = '/transactions'}
        />
      </div>
    );
  }

  const currentMonth = financialData.monthlyData[0];
  const previousMonth = financialData.monthlyData[1];

  const getInsights = () => {
    const insights = []

    if (financialData.trends.expenseChange > 10) {
      insights.push({
        type: "warning",
        title: "Increased Spending",
        description: `Your spending increased by ${financialData.trends.expenseChange.toFixed(1)}% compared to last month`,
        icon: AlertTriangle,
      })
    } else if (financialData.trends.expenseChange < -10) {
      insights.push({
        type: "success",
        title: "Savings Detected",
        description: `You reduced spending by ${Math.abs(financialData.trends.expenseChange).toFixed(1)}% this month`,
        icon: Target,
      })
    }

    if (financialData.trends.savingsRate > 20) {
      insights.push({
        type: "success",
        title: "Great Savings Rate",
        description: `You're saving ${financialData.trends.savingsRate.toFixed(1)}% of your income`,
        icon: Target,
      })
    } else if (financialData.trends.savingsRate < 5) {
      insights.push({
        type: "warning",
        title: "Low Savings Rate",
        description: `Consider reducing expenses to improve your savings rate`,
        icon: AlertTriangle,
      })
    }

    if (currentMonth && financialData.categoryBreakdown.length > 0) {
      const topCategory = financialData.categoryBreakdown[0];
      insights.push({
        type: "info",
        title: "Top Spending Category",
        description: `${topCategory.name} represents ${formatCurrency(topCategory.amount)} of your spending`,
        icon: PieChart,
      })
    }

    if (currentMonth && financialData.merchantBreakdown.length > 0) {
      const topMerchant = financialData.merchantBreakdown[0];
      insights.push({
        type: "info",
        title: "Top Merchant",
        description: `You spent ${formatCurrency(topMerchant.amount)} with ${topMerchant.name} this month`,
        icon: BarChart3,
      })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <div className="container px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your spending patterns and financial health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-6">
          <FinancialFilters
            filters={filters}
            onFiltersChange={updateFilters}
            filterOptions={getFilterOptions}
          />
        </div>
      )}

      {/* View Navigation */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeView === "overview" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("overview")}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeView === "spending" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("spending")}
        >
          <LineChart className="h-4 w-4 mr-2" />
          Spending
        </Button>
        <Button
          variant={activeView === "categories" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("categories")}
        >
          <PieChart className="h-4 w-4 mr-2" />
          Categories
        </Button>
        <Button
          variant={activeView === "comparison" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("comparison")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Comparison
        </Button>
      </div>

      {/* Overview Tab */}
      {activeView === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData.totalIncome)}</div>
                {financialData.trends.incomeChange !== 0 && (
                  <div className="flex items-center pt-1">
                    {financialData.trends.incomeChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs ml-1 ${
                      financialData.trends.incomeChange > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {Math.abs(financialData.trends.incomeChange).toFixed(1)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData.totalExpenses)}</div>
                {financialData.trends.expenseChange !== 0 && (
                  <div className="flex items-center pt-1">
                    {financialData.trends.expenseChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className={`text-xs ml-1 ${
                      financialData.trends.expenseChange > 0 ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {Math.abs(financialData.trends.expenseChange).toFixed(1)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialData.netIncome)}</div>
                <p className="text-xs text-muted-foreground">
                  {financialData.trends.savingsRate.toFixed(1)}% savings rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialData.transactionCount}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatCurrency(financialData.averageTransaction)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>
                  Key observations about your financial health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        insight.type === "success" 
                          ? "bg-emerald-100 text-emerald-600" 
                          : insight.type === "warning"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        <insight.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Spending Tab */}
      {activeView === "spending" && (
        <div className="space-y-6">
          <SpendingChart data={financialData.monthlyData} />
        </div>
      )}

      {/* Categories Tab */}
      {activeView === "categories" && (
        <div className="space-y-6">
          <CategoryBreakdown 
            categories={financialData.categoryBreakdown}
            merchants={financialData.merchantBreakdown}
          />
        </div>
      )}

      {/* Comparison Tab */}
      {activeView === "comparison" && (
        <div className="space-y-6">
          <MonthlyComparison data={financialData.monthlyData} />
        </div>
      )}
    </div>
  )
}
