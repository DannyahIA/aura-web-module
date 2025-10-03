"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Clock,
  Lightbulb,
  Target,
  DollarSign,
  Calendar
} from "lucide-react"
import { useState } from "react"
import { AISuggestion, FinancialPrediction } from "@/hooks/use-ai-financial-suggestions"

interface AISuggestionsDisplayProps {
  suggestions: AISuggestion[]
  predictions: FinancialPrediction | null
  onAcceptSuggestion: (id: string, feedback?: string) => void
  onRejectSuggestion: (id: string, feedback?: string) => void
  onImplementSuggestion: (id: string) => void
  totalPotentialSavings: number
}

export function AISuggestionsDisplay({ 
  suggestions, 
  predictions, 
  onAcceptSuggestion, 
  onRejectSuggestion, 
  onImplementSuggestion,
  totalPotentialSavings 
}: AISuggestionsDisplayProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense_reduction': return <TrendingDown className="h-4 w-4" />
      case 'income_optimization': return <TrendingUp className="h-4 w-4" />
      case 'saving_strategy': return <Target className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const SuggestionCard = ({ suggestion }: { suggestion: AISuggestion }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      selectedSuggestion === suggestion.id ? 'ring-2 ring-blue-500' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(suggestion.type)}
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <Badge className={getPriorityColor(suggestion.priority)}>
                {suggestion.priority}
              </Badge>
            </div>
            <CardDescription>{suggestion.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Economia/mês</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(suggestion.impact.monthlySavings)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confiança da IA */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confiança da IA</span>
            <span>{suggestion.confidence}%</span>
          </div>
          <Progress value={suggestion.confidence} className="h-2" />
        </div>

        {/* Impacto */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(suggestion.impact.yearlyProjection)}
            </div>
            <div className="text-xs text-muted-foreground">Economia anual</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              -{suggestion.impact.reductionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Redução</div>
          </div>
        </div>

        {/* Implementação */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Dificuldade: {suggestion.implementation.difficulty}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {suggestion.implementation.timeToImplement} dias
            </span>
          </div>
        </div>

        {/* Visualização de predição */}
        {suggestion.visualization && (
          <div className="mt-4">
            <h5 className="font-semibold text-sm mb-2">Projeção de Impacto</h5>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={suggestion.visualization.beforeData.map((before, index) => ({
                month: `Mês ${index + 1}`,
                before,
                after: suggestion.visualization.afterData[index] || before
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="before" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Atual" 
                />
                <Line 
                  type="monotone" 
                  dataKey="after" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Com Sugestão" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Reasoning da IA */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h5 className="font-semibold text-sm mb-1 text-blue-900 dark:text-blue-100 flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Análise da IA
          </h5>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {suggestion.reasoning}
          </p>
        </div>

        {/* Ações */}
        {!suggestion.status || suggestion.status === 'pending' ? (
          <div className="flex gap-2">
            <Button 
              onClick={() => onAcceptSuggestion(suggestion.id)}
              className="flex-1"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Aceitar
            </Button>
            <Button 
              onClick={() => onRejectSuggestion(suggestion.id)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        ) : suggestion.status === 'accepted' ? (
          <Button 
            onClick={() => onImplementSuggestion(suggestion.id)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Marcar como Implementada
          </Button>
        ) : (
          <Badge variant="secondary" className="w-full justify-center">
            {suggestion.status === 'implemented' ? 'Implementada' : 'Rejeitada'}
          </Badge>
        )}
      </CardContent>
    </Card>
  )

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Sugestões da IA
          </CardTitle>
          <CardDescription>
            A IA está analisando seus dados para gerar recomendações personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analisando seus dados...</h3>
            <p className="text-muted-foreground">
              Em breve você receberá sugestões personalizadas para otimizar suas finanças
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Sugestões Inteligentes da IA
          </CardTitle>
          <CardDescription>
            Recomendações personalizadas baseadas na análise dos seus dados financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{suggestions.length}</div>
              <div className="text-sm text-muted-foreground">Sugestões Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPotentialSavings)}
              </div>
              <div className="text-sm text-muted-foreground">Economia Potencial/mês</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {suggestions.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Alta Prioridade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sugestões */}
      <div className="grid gap-6">
        {suggestions
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          })
          .map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
      </div>

      {/* Comparação de cenários */}
      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Cenários</CardTitle>
            <CardDescription>
              Como suas finanças podem evoluir com as sugestões da IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">Cenário Atual</div>
                  <div className="text-sm text-muted-foreground">
                    {predictions.baselineScenario.description}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">Com Sugestões da IA</div>
                  <div className="text-sm text-muted-foreground">
                    {predictions.optimizedScenario.description}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictions.baselineScenario.monthlyProjections.map((baseline, index) => ({
                  month: baseline.month,
                  baseline: baseline.netIncome,
                  optimized: predictions.optimizedScenario.monthlyProjections[index]?.netIncome || baseline.netIncome
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="baseline" fill="#ef4444" name="Cenário Atual" />
                  <Bar dataKey="optimized" fill="#10b981" name="Com IA" />
                </BarChart>
              </ResponsiveContainer>

              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  +{formatCurrency(predictions.optimizedScenario.totalSavings)}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  Economia total projetada (+{predictions.optimizedScenario.improvementPercentage}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
