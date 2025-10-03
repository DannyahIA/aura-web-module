"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  closestCorners,
  CollisionDetection
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove,
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Download, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { DEFAULT_WIDGETS, type Widget, type WidgetConfig } from '@/lib/dashboard-config';
import { usePersistentDashboard } from '@/hooks/use-persistent-dashboard';
import { useRealFinancialData } from '@/hooks/use-real-financial-data';

import { FluidDragOverlay } from './fluid-drag-overlay';
import { FluidDropZone } from './fluid-drop-zone';
import { ResizableWidget } from './resizable-widget';
import { WidgetSelector } from './widget-selector';

interface FluidDashboardProps {
  className?: string;
}

export function FluidDashboard({ className }: FluidDashboardProps) {
  const {
    widgets,
    layout,
    configs: widgetConfigs,
    lastUpdated,
    updateWidgets,
    updateLayout,
    updateWidgetConfig,
    resetDashboard,
    exportDashboard,
    importDashboard,
    saveDashboard,
  } = usePersistentDashboard(DEFAULT_WIDGETS);

  const { loading: dataLoading } = useRealFinancialData();
  const { toast } = useToast();
  
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Configure sensors for smooth dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay for touch
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom collision detection for smoother interactions
  const collisionDetection: CollisionDetection = useCallback((args) => {
    return closestCorners(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const widget = widgets.find(w => w.id === active.id);
    setActiveWidget(widget || null);
  }, [widgets]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setDragOverPosition(over?.id as string || null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveWidget(null);
    setDragOverPosition(null);
    
    if (!over || active.id === over.id) return;

    // Calculate enabled widgets locally
    const enabledWidgets = widgets.filter(w => w.enabled);
    const oldIndex = enabledWidgets.findIndex(widget => widget.id === active.id);
    const newIndex = enabledWidgets.findIndex(widget => widget.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder only the enabled widgets
      const reorderedEnabled = arrayMove(enabledWidgets, oldIndex, newIndex);
      
      // Merge back with disabled widgets (keep them at the end)
      const disabledWidgets = widgets.filter(w => !w.enabled);
      const newWidgets = [...reorderedEnabled, ...disabledWidgets];
      
      updateWidgets(newWidgets);
    }
  }, [widgets, updateWidgets]);

  const handleWidgetResize = useCallback((widgetId: string, newSize: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId 
        ? { ...widget, currentSize: newSize }
        : widget
    );
    updateWidgets(updatedWidgets);
  }, [widgets, updateWidgets]);

  const handleWidgetConfig = useCallback((widgetId: string, config: Partial<WidgetConfig>) => {
    updateWidgetConfig(widgetId, config);
  }, [updateWidgetConfig]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId 
        ? { ...widget, enabled: false }
        : widget
    );
    updateWidgets(updatedWidgets);
  }, [widgets, updateWidgets]);

  const handleToggleWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    );
    updateWidgets(updatedWidgets);
  }, [widgets, updateWidgets]);

  const handleExport = useCallback(() => {
    const data = exportDashboard();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportDashboard]);

  const handleReset = useCallback(() => {
    // Clear localStorage to force reload from defaults
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura-dashboard-state');
    }
    resetDashboard();
    // Force page reload to apply defaults
    window.location.reload();
  }, [resetDashboard]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        importDashboard(data);
      } catch (error) {
        console.error('Failed to import dashboard:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [importDashboard]);

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.gridCols}, 1fr)`,
    gridAutoRows: 'minmax(200px, auto)',
    gap: `${layout.gap}px`,
    padding: `${layout.gap}px`,
    width: '100%',
  }), [layout]);

  // Filter only enabled widgets for display
  const enabledWidgets = useMemo(() => 
    widgets.filter(w => w.enabled), 
    [widgets]
  );

  const widgetIds = useMemo(() => 
    enabledWidgets.map(w => w.id), 
    [enabledWidgets]
  );

  // Handle edit mode toggle with save
  const handleEditModeToggle = useCallback(() => {
    if (editMode) {
      // Exiting edit mode - save dashboard
      setIsSaving(true);
      const success = saveDashboard();
      
      setTimeout(() => {
        setIsSaving(false);
        if (success) {
          toast({
            title: "Dashboard Saved",
            description: "Your changes have been saved successfully.",
            duration: 2000,
          });
        }
      }, 500);
    }
    setEditMode(!editMode);
  }, [editMode, saveDashboard, toast]);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            {editMode && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md border border-primary/20 animate-pulse">
                Edit Mode
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            {editMode ? "Drag, resize and configure your widgets" : "Customize your financial overview"}
          </p>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
            <span>Grid: {layout.gridCols} cols × {layout.gridRows} rows | Widgets: {enabledWidgets.length}/{widgets.length}</span>
            {lastUpdated && !editMode && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Check className="w-3 h-3" />
                Saved {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={handleEditModeToggle}
            disabled={isSaving}
            className="gap-2 min-w-[140px]"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {editMode ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {editMode ? "Save & Exit" : "Edit Dashboard"}
              </>
            )}
          </Button>
          
          {editMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2 relative overflow-hidden"
              >
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWidgetSelector(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Widget
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <div 
            className={cn(
              "min-h-[600px] transition-all duration-300 ease-out",
              "bg-muted/20 rounded-xl border border-border/50",
              activeWidget && "bg-muted/30"
            )}
            style={gridStyle}
          >
            {enabledWidgets.map((widget) => (
              <ResizableWidget
                key={widget.id}
                id={widget.id}
                widget={widget}
                config={widgetConfigs[widget.id]}
                editMode={editMode}
                onRemove={() => handleRemoveWidget(widget.id)}
                onSizeChange={handleWidgetResize}
                onConfigChange={handleWidgetConfig}
              />
            ))}
            
            {/* Empty state */}
            {enabledWidgets.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first widget to get started</p>
                  <Button onClick={() => setShowWidgetSelector(true)}>
                    Add Widget
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
        
        <FluidDragOverlay activeWidget={activeWidget} />
      </DndContext>

      {/* Widget Selector Dialog */}
      <WidgetSelector
        open={showWidgetSelector}
        onOpenChange={setShowWidgetSelector}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
      />
    </div>
  );
}
