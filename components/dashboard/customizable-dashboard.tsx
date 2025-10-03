"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Plus, RotateCcw, LayoutGrid, Palette } from "lucide-react";
import { usePageConfig } from "@/hooks/use-page-config";
import { useDashboardLayout } from "@/hooks/use-dashboard-layout";
import { useWidgetConfigs } from "@/hooks/use-widget-configs";

import { ResizableWidget } from "./resizable-widget";
import { WidgetSelector } from "./widget-selector";
import { WIDGET_COMPONENTS } from "@/lib/dashboard-config";

const EmptyGridSlot = () => (
  <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-12 text-center text-muted-foreground/50">
    <LayoutGrid className="h-8 w-8" />
  </div>
);

export function CustomizableDashboard() {
  const [editMode, setEditMode] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  const {
    widgets,
    activeWidget,
    handleDragStart,
    handleDragEnd,
    toggleWidget,
    resetLayout,
    changeWidgetSize,
  } = useDashboardLayout();

  const {
    configs,
    updateConfig,
    getConfig,
    resetAllConfigs,
  } = useWidgetConfigs();

  usePageConfig({
    page: "dashboard",
    title: "Dashboard",
    subtitle: "Your personal and smart control center.",
  });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
  const enabledWidgets = widgets.filter((widget) => widget.enabled);
  const WidgetComponent = activeWidget ? WIDGET_COMPONENTS[activeWidget.type] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={editMode ? "default" : "outline"} onClick={() => setEditMode(!editMode)}>
            <Settings className="h-4 w-4 mr-2" />
            {editMode ? "Finish" : "Edit Layout"}
          </Button>
          {editMode && (
            <>
              <Button variant="outline" onClick={() => setShowWidgetSelector(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Widgets
              </Button>
              <Button variant="outline" onClick={() => { resetLayout(); setEditMode(false); }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
            {enabledWidgets.map((widget) => {
              const WidgetContent = WIDGET_COMPONENTS[widget.type];
              return (
                <ResizableWidget
                  key={widget.id}
                  id={widget.id}
                  widget={widget}
                  config={getConfig(widget.id)}
                  editMode={editMode}
                  onRemove={() => toggleWidget(widget.id)}
                  onSizeChange={changeWidgetSize}
                  onConfigChange={updateConfig}
                >
                  {WidgetContent ? <WidgetContent config={getConfig(widget.id)} /> : <div>Widget Unavailable</div>}
                </ResizableWidget>
              );
            })}
            
            {editMode && (
              <>
                <div className="md:col-span-1"><EmptyGridSlot /></div>
                <div className="md:col-span-1"><EmptyGridSlot /></div>
                <div className="md:col-span-1"><EmptyGridSlot /></div>
                <div className="md:col-span-1"><EmptyGridSlot /></div>
              </>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget && WidgetComponent ? (
            <Card className="h-full opacity-90 shadow-2xl">
              <WidgetComponent />
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
      

      {enabledWidgets.length === 0 && !editMode && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center mt-6">
          <LayoutGrid className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">Your dashboard is empty!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click "Edit Layout" to start adding widgets.
          </p>
        </div>
      )}

      <WidgetSelector
        open={showWidgetSelector}
        onOpenChange={setShowWidgetSelector}
        widgets={widgets}
        onToggleWidget={toggleWidget}
      />
    </div>
  );
}