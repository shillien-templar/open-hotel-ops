import type { UseFormReturn } from "react-hook-form";
import { FieldRenderer } from "@/components/field-renderer";
import { getFormConfig } from "@/lib/forms/core/registry";
import { FieldGroup } from "@/components/ui/field";

interface SetupFormFieldsProps {
  form: UseFormReturn<any>;
}

export function SetupFormFields({ form }: SetupFormFieldsProps) {
  const config = getFormConfig("setup");

  if (!config) {
    return null;
  }

  return (
    <FieldGroup>
      <FieldRenderer
        name="secret"
        id="secret"
        fieldConfig={config.fields.secret}
        form={form}
      />

      <FieldRenderer
        name="email"
        id="email"
        fieldConfig={config.fields.email}
        form={form}
      />

      <FieldRenderer
        name="password"
        id="password"
        fieldConfig={config.fields.password}
        form={form}
      />

      <FieldRenderer
        name="confirmPassword"
        id="confirmPassword"
        fieldConfig={config.fields.confirmPassword}
        form={form}
      />
    </FieldGroup>
  );
}
