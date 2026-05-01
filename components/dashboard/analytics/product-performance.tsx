// components/dashboard/analytics/product-performance.tsx
// Sortable table showing detailed metrics per product.

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPerformanceRow {
  productId: string;
  name: string;
  views: number;
  cartAdds: number;
  purchases: number;
  conversionRate: number;
}

interface ProductPerformanceProps {
  data: ProductPerformanceRow[];
}

type SortField = 'name' | 'views' | 'cartAdds' | 'purchases' | 'conversionRate';

export function ProductPerformanceTable({ data }: ProductPerformanceProps) {
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Product Performance</CardTitle>
        <CardDescription>Detailed breakdown of views and conversions per product</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">Product <SortIcon field="name" /></div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('views')}
                >
                  <div className="flex items-center justify-end">Views <SortIcon field="views" /></div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('cartAdds')}
                >
                  <div className="flex items-center justify-end">Cart Adds <SortIcon field="cartAdds" /></div>
                </TableHead>
                <TableHead 
                    className="text-right"
                >
                  <div className="flex items-center justify-end">Cart Rate (%)</div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('purchases')}
                >
                  <div className="flex items-center justify-end">Orders <SortIcon field="purchases" /></div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('conversionRate')}
                >
                  <div className="flex items-center justify-end">Conv. Rate (%) <SortIcon field="conversionRate" /></div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No products found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.productId} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{row.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.cartAdds.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.views > 0 ? ((row.cartAdds / row.views) * 100).toFixed(1) : 0}%
                    </TableCell>
                    <TableCell className="text-right">{row.purchases.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {row.conversionRate.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
