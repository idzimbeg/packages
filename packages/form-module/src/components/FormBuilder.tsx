import { useState } from "react";
import { useForm, type FieldValues, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./FormField";
import type { FormBuilderProps, FormTheme } from "../types";

// Default styles
const defaultTheme: FormTheme = {
  form: "space-y-4",
  submitButton:
    "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  submitButtonLoading: "opacity-70 cursor-not-allowed",
};

export function FormBuilder<TData extends FieldValues>({
  config,
  className,
  disabled,
}: FormBuilderProps<TData>) {
  const theme = { ...defaultTheme, ...config.theme };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<TData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(config.schema) as any,
    defaultValues: config.defaultValues as DefaultValues<TData>,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await config.onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const isDisabled = disabled || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={className ?? theme.form} noValidate>
      {submitError && (
        <div
          className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {config.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          form={form}
          theme={config.theme}
          disabled={isDisabled}
        />
      ))}

      <button
        type="submit"
        disabled={isDisabled}
        className={`${theme.submitButton} ${isSubmitting ? theme.submitButtonLoading : ""}`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
              />
            </svg>
            {config.loadingText ?? "Submitting..."}
          </>
        ) : (
          (config.submitText ?? "Submit")
        )}
      </button>
    </form>
  );
}

FormBuilder.displayName = "FormBuilder";
