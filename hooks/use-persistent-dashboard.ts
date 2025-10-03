import { useState, useEffect, useCallback } from 'react';
import type { Widget, WidgetConfig } from '@/lib/dashboard-config';

interface DashboardState {
  widgets: Widget[];
  layout: {
    gridCols: number;
    gridRows: number;
    gap: number;
  };
  configs: Record<string, WidgetConfig>;
  lastUpdated: string;
}

const STORAGE_KEY = 'aura-dashboard-state';

// Merge default widgets with saved widgets
const mergeWidgets = (defaultWidgets: Widget[], savedWidgets: Widget[]): Widget[] => {
  const defaultMap = new Map(defaultWidgets.map(w => [w.id, w]));
  const savedMap = new Map(savedWidgets.map(w => [w.id, w]));
  
  // Start with saved widgets in their saved order
  const mergedWidgets = savedWidgets.map(savedWidget => {
    const defaultWidget = defaultMap.get(savedWidget.id);
    if (defaultWidget) {
      // Update from default but keep saved configuration
      return {
        ...savedWidget,
        availableSizes: defaultWidget.availableSizes,
        title: defaultWidget.title, // Keep updated titles
      };
    }
    // Widget exists in saved but not in defaults (removed widget)
    return savedWidget;
  });
  
  // Add new widgets from defaults that don't exist in saved
  defaultWidgets.forEach(defaultWidget => {
    if (!savedMap.has(defaultWidget.id)) {
      mergedWidgets.push(defaultWidget);
    }
  });
  
  return mergedWidgets;
};

export function usePersistentDashboard(defaultWidgets: Widget[]) {
  const [dashboardState, setDashboardState] = useState<DashboardState>(() => {
    if (typeof window === 'undefined') {
      return {
        widgets: defaultWidgets,
        layout: { gridCols: 4, gridRows: 12, gap: 24 },
        configs: {},
        lastUpdated: new Date().toISOString()
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default widgets to handle new widgets
        const mergedWidgets = mergeWidgets(defaultWidgets, parsed.widgets || []);
        return {
          ...parsed,
          widgets: mergedWidgets,
        };
      }
    } catch (error) {
      console.error('Failed to load dashboard state:', error);
    }

    return {
      widgets: defaultWidgets,
      layout: { gridCols: 4, gridRows: 6, gap: 24 },
      configs: {},
      lastUpdated: new Date().toISOString()
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...dashboardState,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to save dashboard state:', error);
      }
    }
  }, [dashboardState]);

  const updateWidgets = useCallback((widgets: Widget[]) => {
    setDashboardState(prev => ({
      ...prev,
      widgets
    }));
  }, []);

  const updateWidgetConfig = useCallback((widgetId: string, config: WidgetConfig) => {
    setDashboardState(prev => ({
      ...prev,
      configs: {
        ...prev.configs,
        [widgetId]: {
          ...prev.configs[widgetId],
          ...config
        }
      }
    }));
  }, []);

  const updateLayout = useCallback((layout: Partial<DashboardState['layout']>) => {
    setDashboardState(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        ...layout
      }
    }));
  }, []);

  const resetDashboard = useCallback(() => {
    setDashboardState({
      widgets: defaultWidgets,
      layout: { gridCols: 4, gridRows: 6, gap: 24 },
      configs: {},
      lastUpdated: new Date().toISOString()
    });
  }, [defaultWidgets]);

  const exportDashboard = useCallback(() => {
    return JSON.stringify(dashboardState, null, 2);
  }, [dashboardState]);

  const importDashboard = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      const mergedWidgets = mergeWidgets(defaultWidgets, imported.widgets || []);
      setDashboardState({
        ...imported,
        widgets: mergedWidgets,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Failed to import dashboard:', error);
      return false;
    }
  }, [defaultWidgets]);

  const getWidgetConfig = useCallback((widgetId: string): WidgetConfig => {
    return dashboardState.configs[widgetId] || {};
  }, [dashboardState.configs]);

  const saveDashboard = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...dashboardState,
          lastUpdated: new Date().toISOString()
        }));
        return true;
      } catch (error) {
        console.error('Failed to save dashboard state:', error);
        return false;
      }
    }
    return false;
  }, [dashboardState]);

  return {
    widgets: dashboardState.widgets,
    layout: dashboardState.layout,
    configs: dashboardState.configs,
    lastUpdated: dashboardState.lastUpdated,
    updateWidgets,
    updateWidgetConfig,
    updateLayout,
    resetDashboard,
    exportDashboard,
    importDashboard,
    getWidgetConfig,
    saveDashboard,
  };
}
