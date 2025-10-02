import { EmptyState } from "@/components/ui/empty-state"
import { Building2, CreditCard, Calendar, TrendingUp } from "lucide-react"

interface EmptyBanksProps {
  onAddBank: () => void
  onRetry?: () => void
  isError?: boolean
  errorMessage?: string
}

export function EmptyBanks({ onAddBank, onRetry, isError, errorMessage }: EmptyBanksProps) {
  return (
    <EmptyState
      icon={<Building2 className="h-16 w-16 text-muted-foreground" />}
      title={isError ? "Erro ao carregar bancos" : "Nenhum banco encontrado"}
      description={
        isError 
          ? errorMessage || "Ocorreu um erro ao tentar carregar seus bancos. Verifique sua conexão e tente novamente."
          : "Você ainda não adicionou nenhum banco. Adicione seu primeiro banco para começar a gerenciar suas finanças."
      }
      actionLabel="Adicionar Banco"
      onAction={onAddBank}
      onRetry={onRetry}
      showRetry={isError}
      isError={isError}
    />
  )
}

interface EmptyTransactionsProps {
  onAddTransaction: () => void
  onRetry?: () => void
  isError?: boolean
  errorMessage?: string
}

export function EmptyTransactions({ onAddTransaction, onRetry, isError, errorMessage }: EmptyTransactionsProps) {
  return (
    <EmptyState
      icon={<CreditCard className="h-16 w-16 text-muted-foreground" />}
      title={isError ? "Erro ao carregar transações" : "Nenhuma transação encontrada"}
      description={
        isError 
          ? errorMessage || "Ocorreu um erro ao tentar carregar suas transações. Verifique sua conexão e tente novamente."
          : "Você ainda não possui transações registradas. Adicione sua primeira transação para começar a acompanhar seus gastos."
      }
      actionLabel="Nova Transação"
      onAction={onAddTransaction}
      onRetry={onRetry}
      showRetry={isError}
      isError={isError}
    />
  )
}

interface EmptyEventsProps {
  onAddEvent: () => void
  onRetry?: () => void
  isError?: boolean
  errorMessage?: string
}

export function EmptyEvents({ onAddEvent, onRetry, isError, errorMessage }: EmptyEventsProps) {
  return (
    <EmptyState
      icon={<Calendar className="h-16 w-16 text-muted-foreground" />}
      title={isError ? "Erro ao carregar eventos" : "Nenhum evento encontrado"}
      description={
        isError 
          ? errorMessage || "Ocorreu um erro ao tentar carregar seus eventos. Verifique sua conexão e tente novamente."
          : "Você não possui eventos no período selecionado. Adicione um novo evento para organizar sua agenda."
      }
      actionLabel="Adicionar Evento"
      onAction={onAddEvent}
      onRetry={onRetry}
      showRetry={isError}
      isError={isError}
    />
  )
}

interface EmptyAnalyticsProps {
  onRetry?: () => void
  isError?: boolean
  errorMessage?: string
}

export function EmptyAnalytics({ onRetry, isError, errorMessage }: EmptyAnalyticsProps) {
  return (
    <EmptyState
      icon={<TrendingUp className="h-16 w-16 text-muted-foreground" />}
      title={isError ? "Erro ao carregar dados" : "Dados insuficientes"}
      description={
        isError 
          ? errorMessage || "Ocorreu um erro ao tentar carregar os dados de análise. Verifique sua conexão e tente novamente."
          : "Não há dados suficientes para gerar análises no período selecionado. Adicione mais transações para visualizar relatórios detalhados."
      }
      onRetry={onRetry}
      showRetry={isError}
      isError={isError}
    />
  )
}
