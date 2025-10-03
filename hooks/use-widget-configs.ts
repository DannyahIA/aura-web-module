import { useState, useEffect, useCallback } from 'react';
import type { WidgetConfig } from '@/lib/dashboard-config';

interface WidgetConfigs {
  [widgetId: string]: WidgetConfig;
}

export function useWidgetConfigs() {
  const [configs, setConfigs] = useState<WidgetConfigs>({});

  // Load configs from localStorage on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem('widget-configs');
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('Failed to parse widget configs:', error);
      }
    }
  }, []);

  // Save configs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('widget-configs', JSON.stringify(configs));
  }, [configs]);

  const updateConfig = useCallback((widgetId: string, config: WidgetConfig) => {
    setConfigs(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        ...config
      }
    }));
  }, []);

  const getConfig = useCallback((widgetId: string): WidgetConfig => {
    return configs[widgetId] || {};
  }, [configs]);

  const resetConfig = useCallback((widgetId: string) => {
    setConfigs(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[widgetId];
      return newConfigs;
    });
  }, []);

  const resetAllConfigs = useCallback(() => {
    setConfigs({});
  }, []);

  return {
    configs,
    updateConfig,
    getConfig,
    resetConfig,
    resetAllConfigs,
  };
}
