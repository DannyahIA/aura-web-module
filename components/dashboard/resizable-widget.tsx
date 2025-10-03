"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  X, 
  Settings, 
  Maximize2, 
  Move3D,
  ChevronRight 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { Widget, WidgetConfig } from '@/lib/dashboard-config';
import { WidgetContent } from './widget-content';

interface ResizableWidgetProps {
  id: string;
  widget: Widget;
  config?: WidgetConfig;
  editMode: boolean;
  onRemove: () => void;
  onSizeChange: (id: string, size: string) => void;
  onConfigChange: (id: string, config: WidgetConfig) => void;
}

export function ResizableWidget({ 
  id, 
  widget, 
  config = {}, 
  editMode, 
  onRemove, 
  onSizeChange, 
  onConfigChange
}: ResizableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    disabled: !editMode // Disable sorting when not in edit mode
  });
  const [isResizing, setIsResizing] = useState(false);
  const [previewSize, setPreviewSize] = useState<string | null>(null);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  const previewSizeRef = useRef<string | null>(null);
  const resizeHandlersRef = useRef<{
    move: ((e: MouseEvent) => void) | null;
    end: (() => void) | null;
  }>({ move: null, end: null });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? 'none' : transition,
  };
  
  // Keep previewSizeRef in sync with previewSize state
  useEffect(() => {
    previewSizeRef.current = previewSize;
  }, [previewSize]);

  // Size mapping using CSS Grid properties directly
  const getSizeStyle = (size: string) => {
    const [cols, rows] = size.split('x').map(Number);
    
    return {
      gridColumn: `span ${cols}`,
      gridRow: `span ${rows}`,
    };
  };

  // Available sizes with labels
  const sizeOptions = [
    { value: '1x1', label: 'Small (1×1)', cols: 1, rows: 1 },
    { value: '2x1', label: 'Wide (2×1)', cols: 2, rows: 1 },
    { value: '1x2', label: 'Tall (1×2)', cols: 1, rows: 2 },
    { value: '2x2', label: 'Medium (2×2)', cols: 2, rows: 2 },
    { value: '3x1', label: 'Extra Wide (3×1)', cols: 3, rows: 1 },
    { value: '3x2', label: 'Large (3×2)', cols: 3, rows: 2 },
    { value: '4x1', label: 'Full Width (4×1)', cols: 4, rows: 1 },
    { value: '4x2', label: 'Extra Large (4×2)', cols: 4, rows: 2 },
    { value: '2x3', label: 'Extra Tall (2×3)', cols: 2, rows: 3 },
    { value: '3x3', label: 'Big Square (3×3)', cols: 3, rows: 3 },
  ];

  // Filter available sizes for this widget
  const availableSizes = sizeOptions.filter(option => 
    widget.availableSizes.includes(option.value)
  );

  // Handle manual resize start
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!widgetRef.current) return;
    
    const rect = widgetRef.current.getBoundingClientRect();
    const startSizeData = { width: rect.width, height: rect.height };
    const startPosData = { x: e.clientX, y: e.clientY };
    
    setStartSize(startSizeData);
    setStartPosition(startPosData);
    setIsResizing(true);
    
    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPosData.x;
      const deltaY = moveEvent.clientY - startPosData.y;
      
      // Calculate new size based on grid increments
      const gridWidth = 304; // 280px + 24px gap
      const gridHeight = 224; // 200px + 24px gap
      
      const newCols = Math.max(1, Math.round((startSizeData.width + deltaX) / gridWidth));
      const newRows = Math.max(1, Math.round((startSizeData.height + deltaY) / gridHeight));
      
      // Clamp to reasonable limits
      const cols = Math.min(4, newCols);
      const rows = Math.min(4, newRows);
      
      const newSize = `${cols}x${rows}`;
      
      // Update preview size in real-time
      if (widget.availableSizes.includes(newSize)) {
        setPreviewSize(newSize);
      }
    };
    
    const handleEnd = () => {
      setIsResizing(false);
      
      // Apply the final size change using the ref (which has the latest value)
      const finalSize = previewSizeRef.current;
      if (finalSize && finalSize !== widget.currentSize) {
        console.log('Applying size change:', widget.id, finalSize);
        onSizeChange(widget.id, finalSize);
      }
      
      setPreviewSize(null);
      previewSizeRef.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Store handlers for cleanup
    resizeHandlersRef.current = { move: handleMove, end: handleEnd };
  }, [widget.availableSizes, widget.currentSize, widget.id, onSizeChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeHandlersRef.current.move) {
        document.removeEventListener('mousemove', resizeHandlersRef.current.move);
      }
      if (resizeHandlersRef.current.end) {
        document.removeEventListener('mouseup', resizeHandlersRef.current.end);
      }
    };
  }, []);

  const sizeStyle = getSizeStyle(previewSize || widget.currentSize);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        gridColumn: sizeStyle.gridColumn,
        gridRow: sizeStyle.gridRow,
      }}
      data-widget-id={widget.id}
      data-widget-size={widget.currentSize}
      className={cn(
        "relative group w-full h-full",
        "min-h-[200px]", // Ensure minimum height
        "transition-all duration-200 ease-out", // Smooth transition
        isDragging && "opacity-50 z-10",
        isResizing && "z-20 scale-[1.02]" // Scale up slightly when resizing
      )}
    >
      <Card 
        ref={widgetRef}
        className={cn(
          "w-full h-full min-h-[200px] transition-all duration-200 ease-out flex flex-col relative overflow-hidden",
          editMode && "ring-2 ring-primary/50",
          isDragging && "ring-primary ring-4 shadow-2xl",
          isResizing && "ring-blue-500 ring-4 shadow-2xl scale-[1.01]",
          !editMode && "cursor-move hover:ring-2 hover:ring-primary/30"
        )}
        {...(!editMode ? { ...attributes, ...listeners } : {})}
      >
        {/* Edit Mode Controls */}
        {editMode && (
          <>
            <div className="absolute inset-0 bg-background/20 z-10 rounded-xl pointer-events-none" />
            
            {/* Top Controls */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
              {/* Widget Config */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Configure {widget.title}</DialogTitle>
                    <DialogDescription>
                      Customize the behavior and appearance of this widget.
                    </DialogDescription>
                  </DialogHeader>
                  <WidgetConfigForm 
                    widget={widget}
                    config={config}
                    onConfigChange={(newConfig) => onConfigChange(widget.id, newConfig)}
                  />
                </DialogContent>
              </Dialog>

              {/* Size Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Widget Size</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableSizes.map((size) => (
                    <DropdownMenuItem
                      key={size.value}
                      onClick={() => onSizeChange(widget.id, size.value)}
                      className={cn(
                        "flex items-center justify-between",
                        widget.currentSize === size.value && "bg-primary/10"
                      )}
                    >
                      <span>{size.label}</span>
                      {widget.currentSize === size.value && (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Drag Handle */}
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-3 w-3" />
              </Button>

              {/* Remove */}
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Resize Handle */}
            <div
              className={cn(
                "absolute bottom-1 right-1 z-20 cursor-nwse-resize transition-all duration-200",
                "opacity-0 group-hover:opacity-100",
                isResizing && "opacity-100 scale-125"
              )}
              onMouseDown={handleResizeStart}
            >
              <div className={cn(
                "w-5 h-5 bg-primary/30 border-2 border-primary/60 rounded-md",
                "flex items-center justify-center",
                "hover:bg-primary/40 hover:border-primary/80",
                "transition-all duration-200",
                "shadow-lg",
                isResizing && "bg-blue-500/40 border-blue-500/80 shadow-xl animate-pulse"
              )}>
                <Move3D className={cn(
                  "h-3 w-3 text-primary transition-all duration-200",
                  isResizing && "text-blue-500 scale-110"
                )} />
              </div>
            </div>

            {/* Resize Overlay */}
            {isResizing && (
              <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] border-2 border-blue-500/30 rounded-xl z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="px-4 py-2 bg-blue-500/20 backdrop-blur-md border-2 border-blue-500/40 rounded-lg">
                    <p className="text-sm font-bold text-blue-600">
                      Resizing to {previewSize || widget.currentSize}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Size Indicator */}
            <div className={cn(
              "absolute bottom-1 left-1 z-20 transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              isResizing && "opacity-100"
            )}>
              <div className={cn(
                "px-3 py-1.5 bg-background/95 backdrop-blur-sm border-2 rounded-md text-xs font-bold",
                "transition-all duration-200 shadow-lg",
                isResizing ? "border-blue-500/60 text-blue-600 scale-110" : "border-border text-muted-foreground"
              )}>
                {previewSize || widget.currentSize}
              </div>
            </div>
          </>
        )}

        {/* Widget Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <WidgetContent 
            widget={widget} 
            config={config}
            className="h-full border-none shadow-none"
          />
        </div>
      </Card>
    </div>
  );
}

// Widget Configuration Form Component
interface WidgetConfigFormProps {
  widget: Widget;
  config: WidgetConfig;
  onConfigChange: (config: WidgetConfig) => void;
}

function WidgetConfigForm({ widget, config, onConfigChange }: WidgetConfigFormProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  // Different config options based on widget type
  const renderConfigOptions = () => {
    switch (widget.type) {
      case 'financial-summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Currency</label>
              <select 
                className="w-full mt-1 p-2 border rounded"
                value={localConfig.currency || 'USD'}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Show Percentage Changes</label>
              <input 
                type="checkbox"
                className="ml-2"
                checked={localConfig.showPercentages !== false}
                onChange={(e) => handleChange('showPercentages', e.target.checked)}
              />
            </div>
          </div>
        );

      case 'spending-breakdown':
      case 'monthly-trends':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Time Period</label>
              <select 
                className="w-full mt-1 p-2 border rounded"
                value={localConfig.timePeriod || '6months'}
                onChange={(e) => handleChange('timePeriod', e.target.value)}
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Chart Type</label>
              <select 
                className="w-full mt-1 p-2 border rounded"
                value={localConfig.chartType || 'default'}
                onChange={(e) => handleChange('chartType', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
          </div>
        );

      case 'recent-transactions':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Number of Transactions</label>
              <select 
                className="w-full mt-1 p-2 border rounded"
                value={localConfig.transactionCount || 5}
                onChange={(e) => handleChange('transactionCount', parseInt(e.target.value))}
              >
                <option value={3}>3 transactions</option>
                <option value={5}>5 transactions</option>
                <option value={10}>10 transactions</option>
                <option value={15}>15 transactions</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Show Bank Names</label>
              <input 
                type="checkbox"
                className="ml-2"
                checked={localConfig.showBankNames !== false}
                onChange={(e) => handleChange('showBankNames', e.target.checked)}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No configuration options available for this widget.
          </div>
        );
    }
  };

  return (
    <div className="py-4">
      {renderConfigOptions()}
    </div>
  );
}
