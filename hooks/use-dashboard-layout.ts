import { useState, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { type DragEndEvent } from "@dnd-kit/core";
import { DEFAULT_WIDGETS, type Widget } from "@/lib/dashboard-config";

const LAYOUT_STORAGE_KEY = "dashboard-layout";

export function useDashboardLayout() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);

  useEffect(() => {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (savedLayout) {
      try {
        const parsedLayout: Widget[] = JSON.parse(savedLayout);
        const fullLayout = DEFAULT_WIDGETS.map(defaultWidget => {
          const savedWidget = parsedLayout.find(w => w.id === defaultWidget.id);
          return savedWidget ? { ...defaultWidget, ...savedWidget } : defaultWidget;
        });
        setWidgets(fullLayout);
      } catch {
        setWidgets(DEFAULT_WIDGETS);
      }
    }
  }, []);

  const saveLayout = useCallback((newWidgets: Widget[]) => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newWidgets));
    setWidgets(newWidgets);
  }, []);

  const handleDragStart = (event: { active: { id: string } }) => {
    const widget = widgets.find(w => w.id === event.active.id);
    setActiveWidget(widget || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWidget(null);
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      saveLayout(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const toggleWidget = useCallback((widgetId: string) => {
    const newWidgets = widgets.map((widget) =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    saveLayout(newWidgets);
  }, [widgets, saveLayout]);

  const changeWidgetSize = useCallback((widgetId: string) => {
    const newWidgets = widgets.map((widget) => {
      if (widget.id === widgetId) {
        const currentSizeIndex = widget.availableSizes.indexOf(widget.currentSize);
        const nextSizeIndex = (currentSizeIndex + 1) % widget.availableSizes.length;
        return { ...widget, currentSize: widget.availableSizes[nextSizeIndex] };
      }
      return widget;
    });
    saveLayout(newWidgets);
  }, [widgets, saveLayout]);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    setWidgets(JSON.parse(JSON.stringify(DEFAULT_WIDGETS)));
  }, []);

  return {
    widgets,
    activeWidget,
    handleDragStart,
    handleDragEnd,
    toggleWidget,
    changeWidgetSize,
    resetLayout,
  };
}