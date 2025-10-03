"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useRealFinancialData } from '@/hooks/use-real-financial-data';

interface RecentTransactionsWidgetProps {
  className?: string;
}

export function RecentTransactionsWidget({ className }: RecentTransactionsWidgetProps) {
  const { recentTransactions, loading } = useRealFinancialData();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No recent transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">Your latest financial activity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const isPositive = transaction.amount >= 0;
            const icon = isPositive ? ArrowUpRight : ArrowDownRight;
            const amountColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
            const iconColor = isPositive ? 'text-emerald-500' : 'text-rose-500';
            
            return (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isPositive ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  {React.createElement(icon, { 
                    className: `h-5 w-5 ${iconColor}` 
                  })}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <p className={`text-sm font-medium ${amountColor}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                    
                    {transaction.bankName && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.bankName}
                        </Badge>
                      </>
                    )}
                    
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary" className="text-xs">
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Need to import React for createElement
import React from 'react';
