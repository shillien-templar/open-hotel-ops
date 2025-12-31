import type { UseFormReturn } from "react-hook-form";
import { FieldRenderer } from "@/components/field-renderer";
import { FieldGroup } from "@/components/ui/field";
import { getFormConfig } from "@/lib/forms/core/registry";

export function CreateUserFormFields({ form }: { form: UseFormReturn<any> }) {
  const config = getFormConfig("create-user");

  if (!config) {
    return null;
  }

  return (
    <FieldGroup>
      <FieldRenderer
        name="name"
        id="name"
        fieldConfig={config.fields.name}
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
        name="role"
        id="role"
        fieldConfig={config.fields.role}
        form={form}
      />
    </FieldGroup>
  );
}
