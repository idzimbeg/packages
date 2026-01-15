import * as React from "react";
import type { Column } from "@tanstack/react-table";

export type DateRangeValue = [string | null, string | null];

export interface DateRangeFilterProps<TData> {
  column: Column<TData, unknown>;
  className?: string;
  inputClassName?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
}

export function DateRangeFilter<TData>({
  column,
  className = "flex items-center gap-2",
  inputClassName = "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  fromPlaceholder = "From",
  toPlaceholder = "To",
}: DateRangeFilterProps<TData>) {
  const value = (column.getFilterValue() ?? [null, null]) as DateRangeValue;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: DateRangeValue = [e.target.value || null, value[1]];
    column.setFilterValue(
      newValue[0] === null && newValue[1] === null ? undefined : newValue
    );
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: DateRangeValue = [value[0], e.target.value || null];
    column.setFilterValue(
      newValue[0] === null && newValue[1] === null ? undefined : newValue
    );
  };

  return (
    <div className={className}>
      <input
        type="date"
        value={value[0] ?? ""}
        onChange={handleFromChange}
        placeholder={fromPlaceholder}
        className={inputClassName}
      />
      <span className="text-muted-foreground">to</span>
      <input
        type="date"
        value={value[1] ?? ""}
        onChange={handleToChange}
        placeholder={toPlaceholder}
        className={inputClassName}
      />
    </div>
  );
}

DateRangeFilter.displayName = "DateRangeFilter";
