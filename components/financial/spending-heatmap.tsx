"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import { TransactionType } from "@/lib/types"

interface SpendingHeatmapProps {
  transactions: TransactionType[]
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface HeatmapCell {
  day: number
  hour: number
  amount: number
  count: number
  intensity: number
}

export function SpendingHeatmap({ transactions }: SpendingHeatmapProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const heatmapData = useMemo(() => {
    // Filter only expense transactions
    const expenseTransactions = transactions.filter(t => 
      t.amount !== undefined && t.amount < 0 && t.transactionDate
    )

    // Initialize heatmap grid
    const grid: HeatmapCell[][] = []
    for (let day = 0; day < 7; day++) {
      grid[day] = []
      for (let hour = 0; hour < 24; hour++) {
        grid[day][hour] = {
          day,
          hour,
          amount: 0,
          count: 0,
          intensity: 0
        }
      }
    }

    // Populate grid with transaction data
    expenseTransactions.forEach(transaction => {
      if (!transaction.transactionDate || !transaction.amount) return
      
      const date = new Date(transaction.transactionDate)
      const day = date.getDay() // 0 = Sunday, 6 = Saturday
      const hour = date.getHours()
      
      if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
        grid[day][hour].amount += Math.abs(transaction.amount)
        grid[day][hour].count += 1
      }
    })

    // Calculate intensity (normalize to 0-1 scale)
    const maxAmount = Math.max(...grid.flat().map(cell => cell.amount))
    if (maxAmount > 0) {
      grid.forEach(dayRow => {
        dayRow.forEach(cell => {
          cell.intensity = cell.amount / maxAmount
        })
      })
    }

    return grid
  }, [transactions])

  // Calculate daily and hourly totals
  const dailyTotals = useMemo(() => {
    return DAYS.map((day, index) => {
      const total = heatmapData[index]?.reduce((sum, cell) => sum + cell.amount, 0) || 0
      const count = heatmapData[index]?.reduce((sum, cell) => sum + cell.count, 0) || 0
      return { day, total, count }
    })
  }, [heatmapData])

  const hourlyTotals = useMemo(() => {
    return HOURS.map(hour => {
      const total = heatmapData.reduce((sum, dayRow) => sum + (dayRow[hour]?.amount || 0), 0)
      const count = heatmapData.reduce((sum, dayRow) => sum + (dayRow[hour]?.count || 0), 0)
      return { hour, total, count }
    })
  }, [heatmapData])

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (intensity <= 0.2) return 'bg-red-100 dark:bg-red-900'
    if (intensity <= 0.4) return 'bg-red-200 dark:bg-red-800'
    if (intensity <= 0.6) return 'bg-red-300 dark:bg-red-700'
    if (intensity <= 0.8) return 'bg-red-400 dark:bg-red-600'
    return 'bg-red-500 dark:bg-red-500'
  }

  const topSpendingDay = dailyTotals.reduce((max, current) => 
    current.total > max.total ? current : max
  )

  const topSpendingHour = hourlyTotals.reduce((max, current) => 
    current.total > max.total ? current : max
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Heatmap de Gastos</CardTitle>
            <CardDescription>
              Padrões de gastos por dia da semana e horário
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Pico: {topSpendingDay.day} às {topSpendingHour.hour}h
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Hour labels */}
              <div className="flex mb-2">
                <div className="w-12"></div>
                {HOURS.filter((_, i) => i % 3 === 0).map(hour => (
                  <div key={hour} className="w-6 text-xs text-center text-muted-foreground">
                    {hour}h
                  </div>
                ))}
              </div>
              
              {/* Heatmap rows */}
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex items-center mb-1">
                  <div className="w-12 text-xs font-medium text-right pr-2">
                    {day}
                  </div>
                  <div className="flex">
                    {HOURS.map(hour => {
                      const cell = heatmapData[dayIndex]?.[hour]
                      return (
                        <div
                          key={hour}
                          className={`w-6 h-4 mx-0.5 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-300 ${getIntensityColor(cell?.intensity || 0)}`}
                          title={`${day} ${hour}h: ${formatCurrency(cell?.amount || 0)} (${cell?.count || 0} transações)`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs">
                <span>Menos</span>
                <div className="flex">
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
                    <div
                      key={intensity}
                      className={`w-3 h-3 ${getIntensityColor(intensity)}`}
                    />
                  ))}
                </div>
                <span>Mais</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily breakdown */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Gastos por Dia</h4>
              <div className="space-y-2">
                {dailyTotals
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 4)
                  .map(({ day, total, count }) => (
                    <div key={day} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{day}</span>
                        <Badge variant="secondary" className="text-xs">
                          {count} transações
                        </Badge>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(total)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Hourly breakdown */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Horários de Pico</h4>
              <div className="space-y-2">
                {hourlyTotals
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 4)
                  .map(({ hour, total, count }) => (
                    <div key={hour} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{hour}h - {hour + 1}h</span>
                        <Badge variant="secondary" className="text-xs">
                          {count} transações
                        </Badge>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(total)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">🔍 Insights Comportamentais</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• <strong>{topSpendingDay.day}</strong> é seu dia de maior gasto ({formatCurrency(topSpendingDay.total)})</p>
              <p>• Horário de pico: <strong>{topSpendingHour.hour}h às {topSpendingHour.hour + 1}h</strong></p>
              <p>• Use esses padrões para planejar melhor seus gastos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
