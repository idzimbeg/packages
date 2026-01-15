import * as React from "react";
import type { Column } from "@tanstack/react-table";

export interface TextFilterProps<TData> {
  column: Column<TData, unknown>;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function TextFilter<TData>({
  column,
  placeholder = "Filter...",
  className = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  debounceMs = 300,
}: TextFilterProps<TData>) {
  const [value, setValue] = React.useState(
    (column.getFilterValue() ?? "") as string
  );

  // Debounce filter updates
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      column.setFilterValue(value || undefined);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, column, debounceMs]);

  // Sync with external changes
  React.useEffect(() => {
    const externalValue = column.getFilterValue() as string | undefined;
    if (externalValue !== value) {
      setValue(externalValue ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

TextFilter.displayName = "TextFilter";
