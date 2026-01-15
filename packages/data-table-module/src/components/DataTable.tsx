import type { FC } from "react";
import { flexRender } from "@tanstack/react-table";
import type { TableConfig, TableTheme, DataTableProps } from "../types";
import { createDataTableHook } from "../hooks/useDataTable";

// Default theme
const defaultTheme: TableTheme = {
  container: "w-full overflow-auto rounded-lg border bg-card",
  table: "w-full caption-bottom text-sm",
  thead: "border-b bg-muted/50",
  theadRow: "",
  th: "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
  thSortable: "cursor-pointer select-none hover:bg-muted/70",
  thSortAsc: "",
  thSortDesc: "",
  tbody: "divide-y",
  tr: "border-b transition-colors",
  trClickable: "cursor-pointer",
  trHover: "hover:bg-muted/50",
  td: "px-4 py-3 align-middle",
  pagination:
    "flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t",
  paginationButton:
    "inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
  paginationButtonDisabled: "opacity-50 cursor-not-allowed",
  paginationInfo: "text-sm text-muted-foreground",
  paginationSelect:
    "rounded-md border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
  loading: "flex items-center justify-center p-8 text-muted-foreground",
  empty: "flex items-center justify-center p-8 text-muted-foreground",
  error: "flex items-center justify-center p-8 text-destructive",
};

export function createDataTable<TData>(config: TableConfig<TData>) {
  const useDataTable = createDataTableHook(config);
  const theme = { ...defaultTheme, ...config.theme };

  const DataTable: FC<DataTableProps<TData>> = ({
    columns,
    onRowClick,
    emptyMessage = "No data available",
    className,
  }) => {
    const { table, isLoading, isError, error, totalRows } =
      useDataTable(columns);

    if (isError) {
      return (
        <div className={className ?? theme.container}>
          <div className={theme.error}>
            Error loading data: {error?.message ?? "Unknown error"}
          </div>
        </div>
      );
    }

    return (
      <div className={className ?? theme.container}>
        {isLoading && <div className={theme.loading}>Loading...</div>}

        {!isLoading && (
          <>
            <div className="overflow-x-auto">
              <table className={theme.table}>
                <thead className={theme.thead}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={theme.theadRow}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort();
                        const sortDirection = header.column.getIsSorted();

                        return (
                          <th
                            key={header.id}
                            className={`${theme.th} ${canSort ? theme.thSortable : ""} ${
                              sortDirection === "asc" ? theme.thSortAsc : ""
                            } ${sortDirection === "desc" ? theme.thSortDesc : ""}`}
                            style={{ width: header.getSize() }}
                            onClick={
                              canSort
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center gap-2">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {config.features?.sorting !== false &&
                                  canSort && (
                                    <span className="ml-1">
                                      {sortDirection === "asc" && "↑"}
                                      {sortDirection === "desc" && "↓"}
                                      {!sortDirection && "↕"}
                                    </span>
                                  )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className={theme.tbody}>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className={theme.empty}>
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => onRowClick?.(row.original)}
                        className={`${theme.tr} ${theme.trHover} ${
                          onRowClick ? theme.trClickable : ""
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={theme.td}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {config.features?.pagination !== false && (
              <div className={theme.pagination}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className={theme.paginationButton}
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={theme.paginationButton}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={theme.paginationButton}
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className={theme.paginationButton}
                  >
                    {">>"}
                  </button>
                </div>

                <span className={theme.paginationInfo}>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>

                <div className="flex items-center gap-2">
                  <span className={theme.paginationInfo}>Rows per page:</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className={theme.paginationSelect}
                  >
                    {[10, 20, 30, 50, 100].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>

                <span className={theme.paginationInfo}>
                  {table.getRowModel().rows.length} of {totalRows} rows
                </span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  DataTable.displayName = "DataTable";

  return { DataTable, useDataTable };
}
