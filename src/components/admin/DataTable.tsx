'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filters?: {
    key: keyof T;
    label: string;
    options: { value: string; label: string }[];
  }[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  actions,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  filterable = false,
  filters = [],
  loading = false,
  emptyMessage = "Aucune donnée disponible"
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filtrage et recherche
  const filteredData = data.filter(item => {
    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = columns.some(column => {
        const value = item[column.key as keyof T];
        return value?.toString().toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Filtres
    for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
      if (filterValue && item[filterKey] !== filterValue) {
        return false;
      }
    }

    return true;
  });

  // Tri
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  const handleSort = (key: keyof T | string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  if (loading) {
    return (
      <Card className="bg-[#111] border-[#232323]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111] border-[#232323]">
      <CardHeader>
        <div className="flex items-center justify-between">
          {title && <CardTitle className="text-white">{title}</CardTitle>}
          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#333] text-white w-64"
                />
              </div>
            )}
            {filterable && filters.map(filter => (
              <select
                key={filter.key as string}
                value={activeFilters[filter.key as string] || ''}
                onChange={(e) => handleFilterChange(filter.key as string, e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] text-white rounded-md px-3 py-2"
              >
                <option value="">{filter.label}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#232323]">
                  {columns.map(column => (
                    <th
                      key={column.key as string}
                      className={`text-left py-3 px-4 text-gray-300 font-medium ${
                        column.sortable ? 'cursor-pointer hover:text-white' : ''
                      } ${column.width || ''}`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <ChevronDown className={`h-4 w-4 transition-transform ${
                            sortConfig?.key === column.key
                              ? sortConfig.direction === 'desc' ? 'rotate-180' : ''
                              : 'opacity-50'
                          }`} />
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && actions.length > 0 && (
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-20">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className="border-b border-[#232323] hover:bg-[#1a1a1a] transition-colors">
                    {columns.map(column => (
                      <td key={column.key as string} className="py-3 px-4 text-gray-300">
                        {column.render
                          ? column.render(item)
                          : item[column.key as keyof T]?.toString() || '-'
                        }
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {actions.map((action, actionIndex) => {
                            const Icon = action.icon;
                            return (
                              <Button
                                key={actionIndex}
                                variant={action.variant || 'secondary'}
                                size="sm"
                                onClick={() => action.onClick(item)}
                                className="h-8 px-2"
                              >
                                {Icon && <Icon className="h-3 w-3" />}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DataTable;