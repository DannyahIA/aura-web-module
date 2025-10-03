"use client";

import React, { useState, useEffect } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Widget } from '@/lib/dashboard-config';

interface FluidDragOverlayProps {
  activeWidget: Widget | null;
  children?: React.ReactNode;
}

export function FluidDragOverlay({ activeWidget, children }: FluidDragOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsDragging(!!activeWidget);
  }, [activeWidget]);

  if (!activeWidget) return null;

  const getSizeClasses = (size: string) => {
    const [cols, rows] = size.split('x').map(Number);
    
    // Calculate approximate dimensions based on grid size
    const width = cols * 280 + (cols - 1) * 24; // 280px per column + 24px gap
    const height = rows * 200 + (rows - 1) * 24; // 200px per row + 24px gap
    
    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const dimensions = getSizeClasses(activeWidget.currentSize);

  return (
    <DragOverlay
      adjustScale={false}
      style={{
        // Smooth transform transitions
        transition: 'transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div
        className={cn(
          "relative transform-gpu",
          "transition-all duration-200 ease-out",
          "hover:scale-105",
          isDragging && "scale-105 rotate-2 shadow-2xl"
        )}
        style={dimensions}
      >
        <Card 
          className={cn(
            "h-full w-full",
            "bg-background/95 backdrop-blur-sm",
            "border-2 border-primary/40",
            "shadow-2xl shadow-primary/20",
            "ring-4 ring-primary/30 ring-offset-2 ring-offset-background/50",
            "transform-gpu transition-all duration-200"
          )}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Widget preview content */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground/90">
                {activeWidget.title}
              </h3>
              <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md font-medium">
                {activeWidget.currentSize}
              </div>
            </div>
            
            {/* Preview content area */}
            <div className="flex-1 bg-muted/30 rounded-md flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-8 h-8 mx-auto mb-2 bg-current opacity-20 rounded"></div>
                <div className="text-xs">Moving widget...</div>
              </div>
            </div>
          </div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-pulse"></div>
          </div>
        </Card>
      </div>
    </DragOverlay>
  );
}
