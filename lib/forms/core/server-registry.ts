import { dataValidation as setupDataValidation, action as setupAction } from "../definitions/setup/server";
import { dataValidation as createUserDataValidation, action as createUserAction } from "../definitions/create-user/server";

/**
 * Server-only registry for form data validation and actions
 * Each form MUST have an entry (even if dataValidation is empty)
 */
export const serverRegistry = {
  setup: {
    dataValidation: setupDataValidation,
    action: setupAction,
  },
  "create-user": {
    dataValidation: createUserDataValidation,
    action: createUserAction,
  },
} as const;

export type ServerFormId = keyof typeof serverRegistry;

/**
 * Get server config by form ID
 * Throws error if form not found to enforce proper configuration
 */
export function getServerConfig(formId: string) {
  const config = serverRegistry[formId as keyof typeof serverRegistry];

  if (!config) {
    throw new Error(
      `Form "${formId}" is not registered in server-registry. All forms must have a server registry entry, even if dataValidation is empty.`
    );
  }

  return config;
}
