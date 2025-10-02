"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, X } from "lucide-react"
import { FinancialFilters as FilterType } from "@/hooks/use-financial-analysis"

interface FinancialFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: Partial<FilterType>) => void
  filterOptions: {
    banks: { label: string; value: string }[]
    categories: { label: string; value: string }[]
  }
}

export function FinancialFilters({
  filters,
  onFiltersChange,
  filterOptions,
}: FinancialFiltersProps) {
  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleBankChange = (bankId: string) => {
    const currentBanks = filters.bankIds || [];
    const newBanks = currentBanks.includes(bankId)
      ? currentBanks.filter(id => id !== bankId)
      : [...currentBanks, bankId];
    
    onFiltersChange({ bankIds: newBanks });
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({ categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: {
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      bankIds: [],
      categories: [],
      minAmount: undefined,
      maxAmount: undefined
    });
  };

  const hasActiveFilters = 
    (filters.bankIds && filters.bankIds.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Customize your financial analysis
          </CardDescription>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">From</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Banks */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Banks</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.banks.map((bank) => (
                <div key={bank.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`bank-${bank.value}`}
                    checked={filters.bankIds?.includes(bank.value) || false}
                    onChange={() => handleBankChange(bank.value)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label 
                    htmlFor={`bank-${bank.value}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {bank.label}
                  </Label>
                </div>
              ))}
              {filterOptions.banks.length === 0 && (
                <p className="text-xs text-muted-foreground">No banks available</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.value}`}
                    checked={filters.categories?.includes(category.value) || false}
                    onChange={() => handleCategoryChange(category.value)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label 
                    htmlFor={`category-${category.value}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
              {filterOptions.categories.length === 0 && (
                <p className="text-xs text-muted-foreground">No categories available</p>
              )}
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amount Range</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="minAmount" className="text-xs text-muted-foreground">Min Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.minAmount || ''}
                  onChange={(e) => onFiltersChange({ 
                    minAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="maxAmount" className="text-xs text-muted-foreground">Max Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  step="0.01"
                  placeholder="No limit"
                  value={filters.maxAmount || ''}
                  onChange={(e) => onFiltersChange({ 
                    maxAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
