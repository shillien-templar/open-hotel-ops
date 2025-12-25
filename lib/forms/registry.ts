import { config as createUserConfig } from "./create-user";
import { config as setupConfig } from "./setup";
import type { FormConfig } from "@/types/forms";

export const formRegistry = {
  "create-user": createUserConfig,
  "setup": setupConfig,
  // Add more forms here as they are created
} as const;

export type FormActionName = keyof typeof formRegistry;

/**
 * Get form config by ID
 */
export function getFormConfig(formId: string): FormConfig | null {
  const config = formRegistry[formId as keyof typeof formRegistry];
  return config ?? null;
}
