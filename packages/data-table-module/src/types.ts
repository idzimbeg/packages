import type {
  ColumnDef,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  Table,
} from "@tanstack/react-table";

// ===== QUERY PARAMS =====
export interface TableQueryParams {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState;
}

// ===== QUERY RESULT =====
export interface TableQueryResult<TData> {
  data: TData[];
  total: number;
}

// ===== THEME CONFIG =====
export interface TableTheme {
  container?: string;
  table?: string;
  thead?: string;
  theadRow?: string;
  th?: string;
  thSortable?: string;
  thSortAsc?: string;
  thSortDesc?: string;
  tbody?: string;
  tr?: string;
  trClickable?: string;
  trHover?: string;
  td?: string;
  pagination?: string;
  paginationButton?: string;
  paginationButtonDisabled?: string;
  paginationInfo?: string;
  paginationSelect?: string;
  loading?: string;
  empty?: string;
  error?: string;
}

// ===== QUERY OPTIONS =====
export interface TableQueryOptions {
  staleTime?: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

// ===== FEATURES CONFIG =====
export interface TableFeatures {
  sorting?: boolean;
  filtering?: boolean;
  pagination?: boolean;
}

// ===== INITIAL STATE =====
export interface TableInitialState {
  pagination?: PaginationState;
  sorting?: SortingState;
  filters?: ColumnFiltersState;
}

// ===== MAIN CONFIG =====
export interface TableConfig<TData> {
  queryKey: string[];
  queryFn: (params: TableQueryParams) => Promise<TableQueryResult<TData>>;
  queryOptions?: TableQueryOptions;
  theme?: TableTheme;
  features?: TableFeatures;
  initialState?: TableInitialState;
}

// ===== DATA TABLE PROPS =====
export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
}

// ===== HOOK RETURN TYPE =====
export interface UseDataTableReturn<TData> {
  table: Table<TData>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  totalRows: number;
}
