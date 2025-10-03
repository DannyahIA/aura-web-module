// lib/dashboard-config.ts

import { QuickStatsWidget } from "@/components/dashboard/widgets/quick-stats-widget";
import { UpcomingBillsWidget } from "@/components/dashboard/widgets/upcoming-bills-widget";
import { HomeAutomationWidget } from "@/components/dashboard/widgets/home-automation-widget";
import { AISuggestionsWidget } from "@/components/dashboard/widgets/ai-suggestions-widget";
import { WeatherWidget } from "@/components/dashboard/widgets/weather-widget";
import { CalendarWidget } from "@/components/dashboard/widgets/calendar-widget";

// Real data widgets
import { FinancialSummaryWidget } from "@/components/dashboard/real-financial-summary";
import { SpendingBreakdownWidget } from "@/components/dashboard/real-spending-breakdown";
import { MonthlyTrendsWidget } from "@/components/dashboard/real-monthly-trends";
import { RecentTransactionsWidget } from "@/components/dashboard/real-recent-transactions";

// NEW INTERFACE: Now with multiple sizes
export interface Widget {
  id: string;
  type: string;
  title: string;
  // The current size in the format 'columns x rows' (e.g., '2x1')
  currentSize: string;
  // A list of all sizes this widget can have
  availableSizes: string[];
  enabled: boolean;
}

// Widget configuration interface
export interface WidgetConfig {
  // Common config
  refreshInterval?: number;
  showHeader?: boolean;
  
  // Financial widgets
  currency?: string;
  timePeriod?: string;
  showPercentages?: boolean;
  chartType?: string;
  
  // Transaction widgets
  transactionCount?: number;
  showBankNames?: boolean;
  
  // Chart widgets
  showLegend?: boolean;
  animateOnLoad?: boolean;
  
  // Any other custom config
  [key: string]: any;
}

export const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "quick-stats": QuickStatsWidget,
  "upcoming-bills": UpcomingBillsWidget,
  "home-automation": HomeAutomationWidget,
  "ai-suggestions": AISuggestionsWidget,
  "weather": WeatherWidget,
  "calendar": CalendarWidget,
  // Real data widgets
  "financial-summary": FinancialSummaryWidget,
  "spending-breakdown": SpendingBreakdownWidget,
  "monthly-trends": MonthlyTrendsWidget,
  "recent-transactions": RecentTransactionsWidget,
};

// UPDATED WIDGETS with new sizes
export const DEFAULT_WIDGETS: Widget[] = [
  { id: "financial-summary", type: "financial-summary", title: "Financial Summary", currentSize: '4x1', availableSizes: ['2x1', '3x1', '4x1', '2x2', '3x2', '4x2'], enabled: true },
  { id: "spending-breakdown", type: "spending-breakdown", title: "Spending Breakdown", currentSize: '2x2', availableSizes: ['2x2', '3x2', '2x3', '3x3'], enabled: true },
  { id: "monthly-trends", type: "monthly-trends", title: "Monthly Trends", currentSize: '2x2', availableSizes: ['2x2', '3x2', '4x2', '2x3', '3x3'], enabled: true },
  { id: "recent-transactions", type: "recent-transactions", title: "Recent Transactions", currentSize: '2x2', availableSizes: ['2x1', '3x1', '4x1', '2x2', '3x2', '2x3'], enabled: true },
  { id: "ai-suggestions", type: "ai-suggestions", title: "AI Suggestions", currentSize: '4x1', availableSizes: ['2x1', '3x1', '4x1', '2x2', '3x2'], enabled: true },
  { id: "weather", type: "weather", title: "Weather", currentSize: '1x1', availableSizes: ['1x1', '1x2', '2x1', '2x2'], enabled: false },
  { id: "calendar", type: "calendar", title: "Calendar", currentSize: '2x2', availableSizes: ['2x2', '2x3', '3x2', '3x3'], enabled: false },
];

export const WIDGET_DESCRIPTIONS: Record<string, string> = {
  "quick-stats": "Overview of your finances with important statistics.",
  "upcoming-bills": "Upcoming bills and pending payments.",
  "home-automation": "Quick control of your home devices.",
  "ai-suggestions": "Smart insights based on your data.",
  "weather": "Weather forecast for your location.",
  "calendar": "Your upcoming events and appointments.",
  // Real data widgets
  "financial-summary": "Real-time overview of your financial health.",
  "spending-breakdown": "Visual breakdown of your spending by category.",
  "monthly-trends": "Income and expense trends over time.",
  "recent-transactions": "Your latest financial transactions.",
};