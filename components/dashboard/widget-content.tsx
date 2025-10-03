"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Activity } from 'lucide-react';
import { useRealFinancialData } from '@/hooks/use-real-financial-data';
import type { Widget, WidgetConfig } from '@/lib/dashboard-config';
import { cn } from '@/lib/utils';

interface WidgetContentProps {
  widget: Widget;
  config?: WidgetConfig;
  className?: string;
}

export function WidgetContent({ widget, config = {}, className }: WidgetContentProps) {
  const { summary, categoryData, monthlyData, recentTransactions, loading } = useRealFinancialData();

  if (loading) {
    return (
      <div className={cn("p-6 h-full", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'financial-summary':
        return (
          <div className={cn("h-full flex flex-col", className)}>
            <div className="p-4 pb-3 border-b">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Financial Summary
              </h3>
            </div>
            <div className="p-4 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Balance</p>
                  <p className="text-lg font-bold text-primary">
                    ${summary.totalBalance.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Net Income</p>
                  <p className={cn(
                    "text-lg font-bold",
                    summary.netIncome >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    ${summary.netIncome.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-sm font-medium text-green-600">
                    +${summary.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="text-sm font-medium text-red-600">
                    -${summary.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Monthly Change</span>
                <div className="flex items-center gap-1">
                  {summary.monthlyChange >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    summary.monthlyChange >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {summary.monthlyChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'spending-breakdown':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Spending Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={categoryData as any}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={50}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-2">
                    {categoryData.slice(0, 3).map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-xs text-muted-foreground">{category.name}</span>
                        </div>
                        <span className="text-xs font-medium">
                          ${category.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No spending data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'monthly-trends':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={monthlyData as any}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        fontSize: '12px',
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No trend data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'recent-transactions':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 4).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium truncate max-w-[120px]">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-xs font-medium",
                          transaction.type === 'INCOME' ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.type === 'INCOME' ? '+' : '-'}$
                          {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        {transaction.bankName && (
                          <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {transaction.bankName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'ai-suggestions':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                    Savings Opportunity
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    You could save $150/month by reducing dining expenses
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-xs font-medium text-green-900 dark:text-green-100">
                    Budget Goal
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    You're on track to meet your monthly savings goal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'weather':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-2xl mb-2">☀️</div>
                <p className="text-sm font-medium">22°C</p>
                <p className="text-xs text-muted-foreground">Sunny</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'calendar':
        return (
          <Card className={className}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-center">
                  <p className="text-lg font-bold">{new Date().getDate()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <p className="font-medium">Meeting at 2pm</p>
                    <p className="text-muted-foreground">Team standup</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Widget content for {widget.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return renderWidgetContent();
}
