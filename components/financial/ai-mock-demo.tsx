"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingDown, Calendar, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Componente de demonstração com dados mockados
export function AIMockDemo() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Dados mockados para demonstração
  const mockSuggestion = {
    title: "Reduza gastos com Uber",
    description: "A IA detectou que você gasta em média $450/mês com Uber. Reduzindo 40% pode economizar $180/mês.",
    category: "Transporte",
    confidence: 85,
    monthlySavings: 180,
    yearlyProjection: 2160,
    reasoning: "Analisando seus padrões de uso, 60% das corridas são em horários de pico. Usando transporte público ou carona pode reduzir significativamente os custos."
  }

  const currentVsProjected = [
    { month: 'Atual', current: 450, projected: 270 },
    { month: 'Mês 1', current: 450, projected: 270 },
    { month: 'Mês 2', current: 450, projected: 270 },
    { month: 'Mês 3', current: 450, projected: 270 },
    { month: 'Mês 4', current: 450, projected: 270 },
    { month: 'Mês 5', current: 450, projected: 270 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Demonstração: Sugestões da IA
          </CardTitle>
          <CardDescription>
            Preview de como as sugestões da IA aparecerão quando integradas com o backend Python
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sugestão Mockada */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <CardTitle className="text-lg">{mockSuggestion.title}</CardTitle>
                <Badge className="bg-red-100 text-red-700">Alta Prioridade</Badge>
              </div>
              <CardDescription>{mockSuggestion.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Economia/mês</div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(mockSuggestion.monthlySavings)}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Métricas */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{mockSuggestion.confidence}%</div>
              <div className="text-sm text-muted-foreground">Confiança IA</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(mockSuggestion.yearlyProjection)}
              </div>
              <div className="text-sm text-muted-foreground">Economia anual</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">-40%</div>
              <div className="text-sm text-muted-foreground">Redução</div>
            </div>
          </div>

          {/* Gráfico de Projeção */}
          <div>
            <h5 className="font-semibold text-sm mb-3">Projeção de Gastos</h5>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={currentVsProjected}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Gasto Atual" 
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Com Sugestão IA" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Reasoning da IA */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <h5 className="font-semibold text-sm mb-2 text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análise da IA
            </h5>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {mockSuggestion.reasoning}
            </p>
          </div>

          {/* Passos de Implementação */}
          <div className="space-y-2">
            <h5 className="font-semibold text-sm">Passos para Implementar:</h5>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <span>Identifique rotas alternativas de transporte público</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <span>Configure alertas para evitar horários de pico</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <span>Considere carona corporativa ou bike sharing</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Aceitar Sugestão
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              Ver Mais Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info sobre integração */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              🚀 Próxima Fase: Integração com Backend Python
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Esta é uma demonstração. Na integração real, o backend Python/GraphQL enviará:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div className="text-left space-y-1">
                <div className="font-semibold">📊 Análises ML:</div>
                <div>• Predições LSTM/ARIMA</div>
                <div>• Clustering comportamental</div>
                <div>• Detecção de anomalias</div>
              </div>
              <div className="text-left space-y-1">
                <div className="font-semibold">🎯 Sugestões IA:</div>
                <div>• Personalizadas por usuário</div>
                <div>• Com confidence scores</div>
                <div>• Passos de implementação</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
