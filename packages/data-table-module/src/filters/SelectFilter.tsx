import type { Column } from "@tanstack/react-table";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFilterProps<TData> {
  column: Column<TData, unknown>;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SelectFilter<TData>({
  column,
  options,
  placeholder = "All",
  className = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
}: SelectFilterProps<TData>) {
  const value = (column.getFilterValue() ?? "") as string;

  return (
    <select
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

SelectFilter.displayName = "SelectFilter";
