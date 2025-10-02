"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TransactionsSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function TransactionsSearch({ 
  onSearch, 
  placeholder = "Search transactions..." 
}: TransactionsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={handleSearch}
        placeholder={placeholder}
        className="pl-9 h-10 w-full bg-background"
      />
    </div>
  );
}
