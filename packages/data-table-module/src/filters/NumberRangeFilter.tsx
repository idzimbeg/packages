import * as React from "react";
import type { Column } from "@tanstack/react-table";

export type NumberRangeValue = [number | null, number | null];

export interface NumberRangeFilterProps<TData> {
  column: Column<TData, unknown>;
  className?: string;
  inputClassName?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  debounceMs?: number;
}

export function NumberRangeFilter<TData>({
  column,
  className = "flex items-center gap-2",
  inputClassName = "flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  debounceMs = 300,
}: NumberRangeFilterProps<TData>) {
  const filterValue = (column.getFilterValue() ?? [
    null,
    null,
  ]) as NumberRangeValue;
  const [localValue, setLocalValue] =
    React.useState<NumberRangeValue>(filterValue);

  // Debounce filter updates
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const hasValue = localValue[0] !== null || localValue[1] !== null;
      column.setFilterValue(hasValue ? localValue : undefined);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [localValue, column, debounceMs]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setLocalValue([val, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setLocalValue([localValue[0], val]);
  };

  return (
    <div className={className}>
      <input
        type="number"
        value={localValue[0] ?? ""}
        onChange={handleMinChange}
        placeholder={minPlaceholder}
        className={inputClassName}
      />
      <span className="text-muted-foreground">-</span>
      <input
        type="number"
        value={localValue[1] ?? ""}
        onChange={handleMaxChange}
        placeholder={maxPlaceholder}
        className={inputClassName}
      />
    </div>
  );
}

NumberRangeFilter.displayName = "NumberRangeFilter";
