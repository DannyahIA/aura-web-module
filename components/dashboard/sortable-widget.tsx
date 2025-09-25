"use client";

import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Expand } from "lucide-react";
import type { Widget } from "@/lib/dashboard-config";
import { cn } from "@/lib/utils";

interface SortableWidgetProps {
  id: string;
  widget: Widget;
  editMode: boolean;
  onRemove: () => void;
  onSizeChange: (id: string) => void; // New prop for resizing
  children: React.ReactNode;
}

export function SortableWidget({ id, widget, editMode, onRemove, onSizeChange, children }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // NEW GRID LOGIC: now reads 'colxrow' and applies the correct classes
  const getGridClasses = (size: string) => {
    const [cols, rows] = size.split('x').map(Number);
    const colSpan = `lg:col-span-${cols}`;
    const rowSpan = `lg:row-span-${rows}`;
    
    // For smaller screens, we can simplify
    if (cols > 2) {
      return `col-span-full md:col-span-2 ${colSpan} ${rowSpan}`;
    }
    if (cols > 1) {
      return `col-span-full md:col-span-${cols} ${rowSpan}`;
    }
    return `col-span-full md:col-span-1 ${rowSpan}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        getGridClasses(widget.currentSize),
        "relative group",
        isDragging && "opacity-50 z-10"
      )}
    >
      <Card className={cn(
        "h-full transition-all flex flex-col", // Added flex flex-col
        editMode && "ring-2 ring-primary/50",
        isDragging && "ring-primary ring-4 shadow-2xl"
      )}>
        {editMode && (
          <>
            <div className="absolute inset-0 bg-background/30 z-10 rounded-xl pointer-events-none" />
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              {widget.availableSizes.length > 1 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onSizeChange(widget.id)}
                  >
                    <Expand className="h-4 w-4" />
                    <span className="sr-only">Change size</span>
                  </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
                <span className="sr-only">Drag widget</span>
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onRemove}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove widget</span>
              </Button>
            </div>
          </>
        )}
        {/* Added flex-1 so the content stretches */}
        <div className="flex-1 flex flex-col">{children}</div>
      </Card>
    </div>
  );
}