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

interface ResizableWidgetProps {
  id: string;
  widget: Widget;
  config?: WidgetConfig;
  editMode: boolean;
  onRemove: () => void;
  onSizeChange: (id: string, size: string) => void;
  onConfigChange: (id: string, config: WidgetConfig) => void;
  children: React.ReactNode;
}

export function ResizableWidget({ 
  id, 
  widget, 
  config = {}, 
  editMode, 
  onRemove, 
  onSizeChange, 
  onConfigChange,
  children 
}: ResizableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? 'none' : transition,
  };

  // Size mapping for grid classes
  const getSizeClasses = (size: string) => {
    const [cols, rows] = size.split('x').map(Number);
    
    // Base classes for responsiveness
    let classes = 'col-span-full';
    
    // Medium screens
    if (cols === 1) classes += ' md:col-span-1';
    else if (cols === 2) classes += ' md:col-span-2';
    else if (cols >= 3) classes += ' md:col-span-full';
    
    // Large screens
    classes += ` lg:col-span-${Math.min(cols, 4)}`;
    
    // Row span (height)
    if (rows > 1) {
      classes += ` row-span-${Math.min(rows, 4)}`;
    }
    
    return classes;
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
    setStartSize({ width: rect.width, height: rect.height });
    setStartPosition({ x: e.clientX, y: e.clientY });
    setIsResizing(true);
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, []);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !widgetRef.current) return;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    // Calculate new size based on grid increments
    const gridWidth = 250; // Approximate widget width
    const gridHeight = 200; // Approximate widget height
    
    const newCols = Math.max(1, Math.round((startSize.width + deltaX) / gridWidth));
    const newRows = Math.max(1, Math.round((startSize.height + deltaY) / gridHeight));
    
    // Clamp to reasonable limits
    const cols = Math.min(4, newCols);
    const rows = Math.min(4, newRows);
    
    const newSize = `${cols}x${rows}`;
    
    // Only update if it's an available size
    if (widget.availableSizes.includes(newSize) && newSize !== widget.currentSize) {
      onSizeChange(widget.id, newSize);
    }
  }, [isResizing, startPosition, startSize, widget.availableSizes, widget.currentSize, widget.id, onSizeChange]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        getSizeClasses(widget.currentSize),
        "relative group",
        isDragging && "opacity-50 z-10",
        isResizing && "z-20"
      )}
    >
      <Card 
        ref={widgetRef}
        className={cn(
          "h-full transition-all flex flex-col relative overflow-hidden",
          editMode && "ring-2 ring-primary/50",
          isDragging && "ring-primary ring-4 shadow-2xl",
          isResizing && "ring-blue-500 ring-4 shadow-xl"
        )}
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
              className="absolute bottom-1 right-1 z-20 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
              onMouseDown={handleResizeStart}
            >
              <div className="w-4 h-4 bg-primary/20 border-2 border-primary/40 rounded-sm flex items-center justify-center hover:bg-primary/30">
                <Move3D className="h-2 w-2 text-primary" />
              </div>
            </div>

            {/* Size Indicator */}
            <div className="absolute bottom-1 left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-2 py-1 bg-background/90 border rounded text-xs font-medium text-muted-foreground">
                {widget.currentSize}
              </div>
            </div>
          </>
        )}

        {/* Widget Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
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
