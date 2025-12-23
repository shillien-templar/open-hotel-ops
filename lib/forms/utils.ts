import { z } from "zod";
import { formDataToObject, objectToFormData } from "./helpers";
import { formRegistry } from "./registry";

/**
 * Get schema by action name
 */
export function getFormSchema(action: string): z.ZodType | null {
  const formConfig = formRegistry[action as keyof typeof formRegistry];
  return formConfig?.schema ?? null;
}

/**
 * Execute form action by name
 */
export async function executeFormAction(
  action: string,
  data: unknown
): Promise<{ status: "success" | "error"; data?: unknown; errors?: Record<string, string> }> {
  const formConfig = formRegistry[action as keyof typeof formRegistry];

  if (!formConfig) {
    return {
      status: "error",
      errors: { _form: "Invalid action" },
    };
  }

  return formConfig.action(data);
}

/**
 * Client-side form submission helper
 */
export async function submitForm(action: string, formData: FormData) {
  const response = await fetch(`/api/forms/${action}`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export { objectToFormData, formDataToObject };
