"use client"

import { useState, useMemo } from "react"
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
} from "lucide-react"
import { usePageConfig } from "@/hooks/use-page-config"

interface MonthlyData {
  month: string
  year: number
  totalSpent: number
  totalIncome: number
  categories: Record<string, number>
  merchants: Record<string, number>
}

const mockMonthlyData: MonthlyData[] = [
  {
    month: "January",
    year: 2024,
    totalSpent: 4280.5,
    totalIncome: 6700.0,
    categories: {
      Food: 890.5,
      Transport: 650.0,
      Supermarket: 580.75,
      Utilities: 445.0,
      Entertainment: 320.9,
      Fuel: 240.0,
      Transfer: 250.0,
      Others: 903.35,
    },
    merchants: {
      Uber: 420.5,
      iFood: 380.0,
      "Pão de Açúcar": 290.75,
      Netflix: 89.7,
      Starbucks: 156.9,
      "Posto Shell": 240.0,
      ENEL: 245.0,
      Others: 2457.65,
    },
  },
  {
    month: "December",
    year: 2023,
    totalSpent: 5120.8,
    totalIncome: 6700.0,
    categories: {
      Food: 1200.5,
      Transport: 780.0,
      Supermarket: 690.75,
      Utilities: 445.0,
      Entertainment: 520.9,
      Fuel: 320.0,
      Transfer: 180.0,
      Others: 983.65,
    },
    merchants: {
      Uber: 520.0,
      iFood: 580.5,
      "Pão de Açúcar": 390.75,
      Netflix: 89.7,
      Starbucks: 200.0,
      "Posto Shell": 320.0,
      ENEL: 245.0,
      Others: 2774.85,
    },
  },
  {
    month: "November",
    year: 2023,
    totalSpent: 3890.2,
    totalIncome: 6700.0,
    categories: {
      Food: 720.5,
      Transport: 580.0,
      Supermarket: 480.75,
      Utilities: 445.0,
      Entertainment: 280.9,
      Fuel: 200.0,
      Transfer: 320.0,
      Others: 863.05,
    },
    merchants: {
      Uber: 380.0,
      iFood: 280.5,
      "Pão de Açúcar": 240.75,
      Netflix: 89.7,
      Starbucks: 120.0,
      "Posto Shell": 200.0,
      ENEL: 245.0,
      Others: 2334.25,
    },
  },
]

const banks = [
  { id: "1", name: "Nubank" },
  { id: "2", name: "Itaú" },
  { id: "3", name: "Banco do Brasil" },
]

export function FinancialAnalysisPage() {
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["1", "2", "3"])
  const [comparisonMonths, setComparisonMonths] = useState(3)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewType, setViewType] = useState<"overview" | "categories" | "trends">("overview")
  const [showFilters, setShowFilters] = useState(false)

  // Configure page information
  usePageConfig({
    page: "finances",
    title: "Financial Analysis",
    subtitle: "Visualize and analyze your financial data"
  })

  const currentMonth = mockMonthlyData[0]
  const previousMonth = mockMonthlyData[1]

  const filteredData = useMemo(() => {
    return mockMonthlyData.slice(0, comparisonMonths)
  }, [comparisonMonths])

  const spendingChange = ((currentMonth.totalSpent - previousMonth.totalSpent) / previousMonth.totalSpent) * 100
  const incomeChange = ((currentMonth.totalIncome - previousMonth.totalIncome) / previousMonth.totalIncome) * 100
  const savingsRate = ((currentMonth.totalIncome - currentMonth.totalSpent) / currentMonth.totalIncome) * 100

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const getInsights = () => {
    const insights = []

    if (spendingChange > 10) {
      insights.push({
        type: "warning",
        title: "Increased Spending",
        description: `Your spending increased by ${spendingChange.toFixed(1)}% compared to last month`,
        icon: AlertTriangle,
      })
    } else if (spendingChange < -10) {
      insights.push({
        type: "success",
        title: "Savings Detected",
        description: `You saved ${Math.abs(spendingChange).toFixed(1)}% compared to last month`,
        icon: TrendingDown,
      })
    }

    const topCategory = Object.entries(currentMonth.categories).sort(([, a], [, b]) => b - a)[0]
    if (topCategory) {
      insights.push({
        type: "info",
        title: "Top Spending Category",
        description: `${topCategory[0]} represents ${formatCurrency(topCategory[1])} of your spending`,
        icon: PieChart,
      })
    }

    const topMerchant = Object.entries(currentMonth.merchants).sort(([, a], [, b]) => b - a)[0]
    if (topMerchant && topMerchant[0] !== "Others") {
      insights.push({
        type: "info",
        title: "Top Individual Expense",
        description: `You spent ${formatCurrency(topMerchant[1])} with ${topMerchant[0]} this month`,
        icon: Target,
      })
    }

    if (savingsRate > 30) {
      insights.push({
        type: "success",
        title: "Excellent Savings Rate",
        description: `You are saving ${savingsRate.toFixed(1)}% of your income`,
        icon: TrendingUp,
      })
    } else if (savingsRate < 10) {
      insights.push({
        type: "warning",
        title: "Low Savings Rate",
        description: `Consider reducing expenses. Current rate: ${savingsRate.toFixed(1)}%`,
        icon: AlertTriangle,
      })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spending</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat">{formatCurrency(currentMonth.totalSpent)}</div>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    spendingChange > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {spendingChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(spendingChange).toFixed(1)}% vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat">{formatCurrency(currentMonth.totalIncome)}</div>
                <p
                  className={`text-xs flex items-center gap-1 ${incomeChange >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {incomeChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(incomeChange).toFixed(1)}% vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(currentMonth.totalIncome - currentMonth.totalSpent)} saved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat">{formatCurrency(currentMonth.totalSpent / 31)}</div>
                <p className="text-xs text-muted-foreground">Average daily spending</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and View Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-montserrat">Analysis Controls</CardTitle>
                  <CardDescription>Customize your financial view</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewType === "overview" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType("overview")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={viewType === "categories" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType("categories")}
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Categories
                  </Button>
                  <Button
                    variant={viewType === "trends" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewType("trends")}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Trends
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide" : "Show"} Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent>
                <FinancialFilters
                  selectedBanks={selectedBanks}
                  setSelectedBanks={setSelectedBanks}
                  comparisonMonths={comparisonMonths}
                  setComparisonMonths={setComparisonMonths}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  banks={banks}
                  categories={Object.keys(currentMonth.categories)}
                />
              </CardContent>
            )}
          </Card>

          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Smart Insights</CardTitle>
                <CardDescription>Automated analysis of your financial patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        insight.type === "success"
                          ? "bg-green-50 border-green-200"
                          : insight.type === "warning"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <insight.icon
                          className={`h-5 w-5 mt-0.5 ${
                            insight.type === "success"
                              ? "text-green-600"
                              : insight.type === "warning"
                                ? "text-yellow-600"
                                : "text-blue-600"
                          }`}
                        />
                        <div>
                          <h4
                            className={`font-semibold mb-1 ${
                              insight.type === "success"
                                ? "text-green-800"
                                : insight.type === "warning"
                                  ? "text-yellow-800"
                                  : "text-blue-800"
                            }`}
                          >
                            {insight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts and Analysis */}
          {viewType === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart data={filteredData} />
              <MonthlyComparison currentMonth={currentMonth} previousMonth={previousMonth} />
            </div>
          )}

          {viewType === "categories" && <CategoryBreakdown data={currentMonth} />}

          {viewType === "trends" && (
            <div className="grid grid-cols-1 gap-6">
              <SpendingChart data={filteredData} />
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Trend Analysis</CardTitle>
                  <CardDescription>Spending patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(currentMonth.categories).map(([category, amount]) => {
                      const previousAmount = previousMonth.categories[category] || 0
                      const change = previousAmount > 0 ? ((amount - previousAmount) / previousAmount) * 100 : 0

                      return (
                        <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium">{category}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(amount)} this month</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={change > 0 ? "destructive" : change < 0 ? "default" : "secondary"}
                              className="mb-1"
                            >
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </Badge>
                            <p className="text-xs text-muted-foreground">vs last month</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
    </div>
  )
}
