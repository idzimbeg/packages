// Main factory
export { createDataTable } from "./components/DataTable";

// Hook factory
export { createDataTableHook } from "./hooks/useDataTable";

// Filters
export {
  TextFilter,
  SelectFilter,
  DateRangeFilter,
  NumberRangeFilter,
  type TextFilterProps,
  type SelectFilterProps,
  type SelectOption,
  type DateRangeFilterProps,
  type DateRangeValue,
  type NumberRangeFilterProps,
  type NumberRangeValue,
} from "./filters";

// Types
export type {
  TableConfig,
  TableTheme,
  TableQueryParams,
  TableQueryResult,
  TableQueryOptions,
  TableFeatures,
  TableInitialState,
  DataTableProps,
  UseDataTableReturn,
} from "./types";
