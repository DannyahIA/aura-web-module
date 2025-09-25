"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { WIDGET_DESCRIPTIONS, type Widget } from "@/lib/dashboard-config";

interface WidgetSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgets: Widget[];
  onToggleWidget: (widgetId: string) => void;
}

export function WidgetSelector({ open, onOpenChange, widgets, onToggleWidget }: WidgetSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Widgets</DialogTitle>
          <DialogDescription>
            Enable or disable the widgets you want to see on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {widgets.map((widget) => (
            <Card key={widget.id} className={`transition-all ${widget.enabled ? "border-primary" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-base">{widget.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {WIDGET_DESCRIPTIONS[widget.type]}
                    </CardDescription>
                  </div>
                  <Switch checked={widget.enabled} onCheckedChange={() => onToggleWidget(widget.id)} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}