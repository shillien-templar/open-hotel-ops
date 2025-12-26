'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getFormConfig } from "@/lib/forms/core/registry";
import { objectToFormData } from "@/lib/forms/core/helpers";
import { formComponentRegistry } from "@/components/forms/registry";
import { Button } from "@/components/ui/button";
import { Alert as AlertComponent, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Alert } from "@/lib/types/alert";

interface FormRendererProps {
  formId: string;
  onSuccess?: (result: any) => void;
  onError?: (result: any) => void;
  submitButtonText?: string;
}

export function FormRenderer({
  formId,
  onSuccess,
  onError,
  submitButtonText = "Submit"
}: FormRendererProps) {
  const [alert, setAlert] = useState<Alert | null>(null);

  // Get form config from client-safe registry
  const config = getFormConfig(formId);

  if (!config) {
    return (
      <div className="text-destructive">
        Form "{formId}" not found in registry.
      </div>
    );
  }

  // Get form-specific field component
  const FormFieldsComponent = formComponentRegistry[formId];

  if (!FormFieldsComponent) {
    return (
      <div className="text-destructive">
        Form fields component for "{formId}" not found. Please add it to components/forms/registry.ts
      </div>
    );
  }

  // Set up default values from field configs
  const defaultValues = Object.entries(config.fields).reduce((acc, [fieldName, fieldConfig]) => {
    acc[fieldName] = fieldConfig.defaultValue;
    return acc;
  }, {} as Record<string, unknown>);

  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues,
  });

  const onSubmit = async (data: any) => {
    setAlert(null);

    try {
      const formData = objectToFormData(data);
      const response = await fetch(`/api/forms/${formId}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.alert) {
        setAlert(result.alert);
      }

      if (result.status === "success") {
        form.reset();
        onSuccess?.(result);
      } else {
        onError?.(result);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setAlert({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
      });
      onError?.(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Alert */}
      {alert && (
        <AlertComponent variant={alert.variant}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && (
            <AlertDescription>{alert.description}</AlertDescription>
          )}
        </AlertComponent>
      )}

      {/* Form-specific fields */}
      <FormFieldsComponent form={form} />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Submitting..." : submitButtonText}
      </Button>
    </form>
  );
}
