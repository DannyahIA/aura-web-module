"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Target, TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react"
import { useState } from "react"

interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  type: 'savings' | 'expense_reduction' | 'income_increase'
}

interface FinancialGoalsTrackerProps {
  goals: FinancialGoal[]
  onAddGoal?: () => void
  onEditGoal?: (goalId: string) => void
}

export function FinancialGoalsTracker({ goals, onAddGoal, onEditGoal }: FinancialGoalsTrackerProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getGoalProgress = (goal: FinancialGoal) => {
    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
    const remaining = goal.targetAmount - goal.currentAmount
    const daysUntilDeadline = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return {
      percentage: progress,
      remaining,
      daysUntilDeadline,
      isOverdue: daysUntilDeadline < 0,
      isOnTrack: progress >= 75 || daysUntilDeadline > 30
    }
  }

  const getGoalTypeInfo = (type: FinancialGoal['type']) => {
    switch (type) {
      case 'savings':
        return { label: 'Economia', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' }
      case 'expense_reduction':
        return { label: 'Redução de Gastos', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900' }
      case 'income_increase':
        return { label: 'Aumento de Renda', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900' }
    }
  }

  const GaugeChart = ({ goal }: { goal: FinancialGoal }) => {
    const progress = getGoalProgress(goal)
    const data = [
      { name: 'Progresso', value: progress.percentage, color: '#10b981' },
      { name: 'Restante', value: 100 - progress.percentage, color: '#e5e7eb' }
    ]

    return (
      <div className="relative">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.percentage.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Concluído</div>
          </div>
        </div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos Financeiros
          </CardTitle>
          <CardDescription>
            Defina e acompanhe suas metas financeiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum objetivo definido</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seus primeiros objetivos financeiros
            </p>
            {onAddGoal && (
              <Button onClick={onAddGoal} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Objetivo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos Financeiros
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso das suas metas financeiras
              </CardDescription>
            </div>
            {onAddGoal && (
              <Button onClick={onAddGoal} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Objetivo
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = getGoalProgress(goal)
          const typeInfo = getGoalTypeInfo(goal.type)
          
          return (
            <Card 
              key={goal.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedGoal === goal.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={typeInfo.color}>
                        {typeInfo.label}
                      </Badge>
                      <Badge variant="outline">
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Meta</div>
                    <div className="font-bold">{formatCurrency(goal.targetAmount)}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Gauge Chart */}
                <GaugeChart goal={goal} />
                
                {/* Progress Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Atual: {formatCurrency(goal.currentAmount)}</span>
                    <span className={progress.remaining > 0 ? 'text-muted-foreground' : 'text-green-600'}>
                      {progress.remaining > 0 
                        ? `Faltam ${formatCurrency(progress.remaining)}`
                        : 'Meta atingida! 🎉'
                      }
                    </span>
                  </div>
                  
                  <Progress value={progress.percentage} className="h-2" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {progress.isOverdue ? (
                        <span className="text-red-600">
                          Venceu há {Math.abs(progress.daysUntilDeadline)} dias
                        </span>
                      ) : (
                        <span>
                          {progress.daysUntilDeadline} dias restantes
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {progress.isOnTrack ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={progress.isOnTrack ? 'text-green-600' : 'text-red-600'}>
                        {progress.isOnTrack ? 'No prazo' : 'Atrasado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedGoal === goal.id && onEditGoal && (
                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditGoal(goal.id)
                      }}
                      className="w-full"
                    >
                      Editar Objetivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo dos Objetivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => getGoalProgress(g).percentage >= 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {goals.filter(g => {
                  const p = getGoalProgress(g)
                  return p.percentage < 100 && p.isOnTrack
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">No Prazo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {goals.filter(g => {
                  const p = getGoalProgress(g)
                  return p.percentage < 100 && !p.isOnTrack
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Atrasados</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
