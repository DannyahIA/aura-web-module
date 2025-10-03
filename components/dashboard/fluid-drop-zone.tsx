"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface FluidDropZoneProps {
  id: string;
  isOver?: boolean;
  canDrop?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function FluidDropZone({ 
  id, 
  isOver = false, 
  canDrop = true, 
  children, 
  className 
}: FluidDropZoneProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-all duration-300 ease-out transform-gpu",
        "rounded-xl border-2 border-dashed",
        
        // Default state
        "border-transparent bg-transparent",
        
        // Can drop state
        canDrop && [
          "hover:border-primary/30 hover:bg-primary/5",
          "hover:scale-[1.02] hover:shadow-sm"
        ],
        
        // Is over state (when dragging over)
        isOver && canDrop && [
          "border-primary/60 bg-primary/10",
          "scale-[1.05] shadow-lg shadow-primary/20",
          "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
        ],
        
        // Cannot drop state
        !canDrop && isOver && [
          "border-destructive/60 bg-destructive/10",
          "scale-95 opacity-60"
        ],
        
        className
      )}
    >
      {/* Drop indicator */}
      {isOver && canDrop && (
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-primary/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full">
              <div className="w-8 h-8 bg-primary/40 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Invalid drop indicator */}
      {isOver && !canDrop && (
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center w-16 h-16 bg-destructive/20 rounded-full">
              <svg 
                className="w-8 h-8 text-destructive" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}
