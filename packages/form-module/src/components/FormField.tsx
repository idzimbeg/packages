import type { FieldValues, ControllerRenderProps } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { FormFieldProps, FormTheme } from "../types";

// Default styles
const defaultTheme: FormTheme = {
  fieldWrapper: "space-y-2",
  label: "text-sm font-medium leading-none",
  labelRequired: "text-destructive ml-1",
  input:
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  inputError: "border-destructive focus-visible:ring-destructive",
  select:
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  textarea:
    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  checkbox:
    "h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  checkboxLabel: "text-sm font-medium leading-none ml-2",
  radio:
    "h-4 w-4 shrink-0 rounded-full border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  radioLabel: "text-sm font-medium leading-none ml-2",
  radioGroup: "flex flex-col space-y-2",
  description: "text-sm text-muted-foreground",
  error: "text-sm text-destructive",
};

export function FormField<TFieldValues extends FieldValues>({
  field: fieldConfig,
  form,
  theme: propTheme,
  disabled,
}: FormFieldProps<TFieldValues>) {
  const theme = { ...defaultTheme, ...propTheme };
  const error = form.formState.errors[fieldConfig.name];
  const hasError = !!error;

  const renderInput = (
    field: ControllerRenderProps<TFieldValues>,
    inputType: string
  ) => {
    const baseClassName = `${theme.input} ${hasError ? theme.inputError : ""}`;

    switch (inputType) {
      case "textarea":
        return (
          <textarea
            {...field}
            id={fieldConfig.name}
            placeholder={fieldConfig.placeholder}
            disabled={disabled || fieldConfig.disabled}
            rows={fieldConfig.rows ?? 3}
            className={`${theme.textarea} ${hasError ? theme.inputError : ""}`}
          />
        );

      case "select":
        return (
          <select
            {...field}
            id={fieldConfig.name}
            disabled={disabled || fieldConfig.disabled}
            multiple={fieldConfig.multiple}
            className={`${theme.select} ${hasError ? theme.inputError : ""}`}
          >
            {fieldConfig.placeholder && (
              <option value="">{fieldConfig.placeholder}</option>
            )}
            {fieldConfig.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={fieldConfig.name}
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled || fieldConfig.disabled}
              className={theme.checkbox}
            />
            {fieldConfig.label && (
              <label htmlFor={fieldConfig.name} className={theme.checkboxLabel}>
                {fieldConfig.label}
              </label>
            )}
          </div>
        );

      case "radio":
        return (
          <div className={theme.radioGroup}>
            {fieldConfig.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${fieldConfig.name}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  disabled={disabled || fieldConfig.disabled || option.disabled}
                  className={theme.radio}
                />
                <label
                  htmlFor={`${fieldConfig.name}-${option.value}`}
                  className={theme.radioLabel}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            id={fieldConfig.name}
            accept={fieldConfig.accept}
            multiple={fieldConfig.multiple}
            disabled={disabled || fieldConfig.disabled}
            onChange={(e) => {
              const files = e.target.files;
              field.onChange(fieldConfig.multiple ? files : files?.[0]);
            }}
            className={baseClassName}
          />
        );

      default:
        return (
          <input
            {...field}
            type={inputType}
            id={fieldConfig.name}
            placeholder={fieldConfig.placeholder}
            disabled={disabled || fieldConfig.disabled}
            autoComplete={fieldConfig.autoComplete}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step}
            value={field.value ?? ""}
            className={baseClassName}
          />
        );
    }
  };

  // For checkbox, don't render separate label
  if (fieldConfig.type === "checkbox") {
    return (
      <Controller
        name={fieldConfig.name}
        control={form.control}
        render={({ field }) => (
          <div className={theme.fieldWrapper}>
            {renderInput(field, "checkbox")}
            {fieldConfig.description && (
              <p className={theme.description}>{fieldConfig.description}</p>
            )}
            {error && (
              <p className={theme.error}>{error.message as string}</p>
            )}
          </div>
        )}
      />
    );
  }

  return (
    <Controller
      name={fieldConfig.name}
      control={form.control}
      render={({ field }) => (
        <div className={theme.fieldWrapper}>
          {fieldConfig.label && (
            <label htmlFor={fieldConfig.name} className={theme.label}>
              {fieldConfig.label}
            </label>
          )}
          {renderInput(field, fieldConfig.type)}
          {fieldConfig.description && (
            <p className={theme.description}>{fieldConfig.description}</p>
          )}
          {error && <p className={theme.error}>{error.message as string}</p>}
        </div>
      )}
    />
  );
}

FormField.displayName = "FormField";
