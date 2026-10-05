"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  actions?: number; // number of action buttons (default 0 = no actions column)
}

export function TableSkeleton({ rows = 5, columns = 4, actions = 0 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
          {actions > 0 && (
            <TableHead>
              <Skeleton className="h-4 w-16" />
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
            {actions > 0 && (
              <TableCell>
                <div className="flex gap-2">
                  {Array.from({ length: actions }).map((_, actionIndex) => (
                    <Skeleton key={actionIndex} className="h-8 w-8" />
                  ))}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
