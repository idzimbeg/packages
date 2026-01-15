import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { FormConfig, UseFormBuilderReturn } from "../types";

export function useFormBuilder<TData extends FieldValues>(
  config: FormConfig<TData>
): UseFormBuilderReturn<TData> {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(config.schema) as any,
    defaultValues: config.defaultValues as DefaultValues<TData>,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const isValid = await form.trigger();
      if (!isValid) return;

      setIsSubmitting(true);

      try {
        const data = form.getValues();
        await config.onSubmit(data);
      } catch (error) {
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, config]
  );

  const reset = useCallback(() => {
    form.reset(config.defaultValues as DefaultValues<TData>);
  }, [form, config.defaultValues]);

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting,
    errors: form.formState.errors,
    reset,
  };
}
