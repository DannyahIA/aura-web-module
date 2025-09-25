// lib/dashboard-config.ts

import { QuickStatsWidget } from "@/components/dashboard/widgets/quick-stats-widget";
import { UpcomingBillsWidget } from "@/components/dashboard/widgets/upcoming-bills-widget";
import { HomeAutomationWidget } from "@/components/dashboard/widgets/home-automation-widget";
import { AISuggestionsWidget } from "@/components/dashboard/widgets/ai-suggestions-widget";
import { WeatherWidget } from "@/components/dashboard/widgets/weather-widget";
import { CalendarWidget } from "@/components/dashboard/widgets/calendar-widget";

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

export const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "quick-stats": QuickStatsWidget,
  "upcoming-bills": UpcomingBillsWidget,
  "home-automation": HomeAutomationWidget,
  "ai-suggestions": AISuggestionsWidget,
  "weather": WeatherWidget,
  "calendar": CalendarWidget,
};

// UPDATED WIDGETS with new sizes
export const DEFAULT_WIDGETS: Widget[] = [
  { id: "quick-stats", type: "quick-stats", title: "Quick Stats", currentSize: '4x1', availableSizes: ['4x1', '2x2'], enabled: true },
  { id: "upcoming-bills", type: "upcoming-bills", title: "Upcoming Bills", currentSize: '2x2', availableSizes: ['2x1', '2x2'], enabled: true },
  { id: "home-automation", type: "home-automation", title: "Home Control", currentSize: '2x2', availableSizes: ['2x1', '2x2'], enabled: true },
  { id: "ai-suggestions", type: "ai-suggestions", title: "AI Suggestions", currentSize: '4x1', availableSizes: ['4x1', '2x2'], enabled: true },
  { id: "weather", type: "weather", title: "Weather", currentSize: '1x1', availableSizes: ['1x1', '2x1'], enabled: true },
  { id: "calendar", type: "calendar", title: "Calendar", currentSize: '2x2', availableSizes: ['2x2', '2x1', '4x1'], enabled: true },
];

export const WIDGET_DESCRIPTIONS: Record<string, string> = {
  "quick-stats": "Overview of your finances with important statistics.",
  "upcoming-bills": "Upcoming bills and pending payments.",
  "home-automation": "Quick control of your home devices.",
  "ai-suggestions": "Smart insights based on your data.",
  "weather": "Weather forecast for your location.",
  "calendar": "Your upcoming events and appointments.",
};