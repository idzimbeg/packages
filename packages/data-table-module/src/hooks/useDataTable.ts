import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { TableConfig, UseDataTableReturn } from "../types";

export function createDataTableHook<TData>(config: TableConfig<TData>) {
  return function useDataTable(
    columns: ColumnDef<TData>[]
  ): UseDataTableReturn<TData> {
    const [pagination, setPagination] = React.useState<PaginationState>(
      config.initialState?.pagination ?? { pageIndex: 0, pageSize: 10 }
    );
    const [sorting, setSorting] = React.useState<SortingState>(
      config.initialState?.sorting ?? []
    );
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      config.initialState?.filters ?? []
    );

    // TanStack Query for data fetching
    const { data, isLoading, isError, error, refetch } = useQuery({
      queryKey: [...config.queryKey, pagination, sorting, columnFilters],
      queryFn: () =>
        config.queryFn({ pagination, sorting, filters: columnFilters }),
      staleTime: config.queryOptions?.staleTime ?? 30000,
      refetchInterval: config.queryOptions?.refetchInterval,
      refetchOnWindowFocus: config.queryOptions?.refetchOnWindowFocus ?? false,
    });

    const table = useReactTable({
      data: data?.data ?? [],
      columns,
      pageCount: data ? Math.ceil(data.total / pagination.pageSize) : 0,
      state: {
        pagination,
        sorting,
        columnFilters,
      },
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel:
        config.features?.sorting !== false ? getSortedRowModel() : undefined,
      getFilteredRowModel:
        config.features?.filtering !== false
          ? getFilteredRowModel()
          : undefined,
      getPaginationRowModel:
        config.features?.pagination !== false
          ? getPaginationRowModel()
          : undefined,
      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,
    });

    return {
      table,
      isLoading,
      isError,
      error: error as Error | null,
      refetch,
      totalRows: data?.total ?? 0,
    };
  };
}
