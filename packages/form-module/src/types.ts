import type {
  UseFormReturn,
  FieldValues,
  Path,
  FieldErrors,
} from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZodSchema<T = any> = {
  parse: (data: unknown) => T;
  safeParse: (data: unknown) => { success: boolean; data?: T; error?: unknown };
};

// ===== FIELD TYPES =====
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local"
  | "file";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// ===== FIELD CONFIG =====
export interface FieldConfig<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  options?: SelectOption[]; // For select, radio
  disabled?: boolean;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  rows?: number; // For textarea
  accept?: string; // For file
  multiple?: boolean; // For file, select
}

// ===== THEME CONFIG =====
export interface FormTheme {
  form?: string;
  fieldWrapper?: string;
  label?: string;
  labelRequired?: string;
  input?: string;
  inputError?: string;
  select?: string;
  textarea?: string;
  checkbox?: string;
  checkboxLabel?: string;
  radio?: string;
  radioLabel?: string;
  radioGroup?: string;
  description?: string;
  error?: string;
  submitButton?: string;
  submitButtonLoading?: string;
}

// ===== FORM CONFIG =====
export interface FormConfig<TData extends FieldValues> {
  fields: FieldConfig<TData>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any; // Zod schema - using any for v3/v4 compatibility
  defaultValues?: Partial<TData>;
  theme?: FormTheme;
  onSubmit: (data: TData) => Promise<void> | void;
  submitText?: string;
  loadingText?: string;
}

// ===== FORM BUILDER PROPS =====
export interface FormBuilderProps<TData extends FieldValues> {
  config: FormConfig<TData>;
  className?: string;
  disabled?: boolean;
}

// ===== FORM FIELD PROPS =====
export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  field: FieldConfig<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  theme?: FormTheme;
  disabled?: boolean;
}

// ===== HOOK RETURN TYPE =====
export interface UseFormBuilderReturn<TData extends FieldValues> {
  form: UseFormReturn<TData>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errors: FieldErrors<TData>;
  reset: () => void;
}
