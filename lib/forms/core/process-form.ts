import { formDataToObject } from "./helpers";
import { getFormConfig } from "./registry";
import { getServerConfig } from "./server-registry";
import { validateSchema, validateData } from "./validation";

/**
 * Process Form
 * Universal form handler that orchestrates validation and action execution
 *
 * Flow:
 * 1. Get form config by ID
 * 2. Get server config by ID (enforces all forms have server registry entry)
 * 3. Validate schema (Type 1)
 * 4. If schema valid, validate data (Type 2) using server registry validators
 * 5. If both valid, execute action
 *
 * @param formId - Form identifier (e.g., "setup", "create-user")
 * @param formData - Raw form data (FormData or object)
 * @returns Action result or validation error
 */
export async function processForm(
  formId: string,
  formData: FormData | Record<string, unknown>
) {
  // Get form config
  const config = getFormConfig(formId);

  if (!config) {
    return {
      status: 'fail',
      alert: {
        variant: 'destructive',
        title: 'Invalid Form',
        description: 'The form you are trying to submit does not exist.',
      },
    };
  }

  // Get server config (throws if not found - enforces proper configuration)
  const serverConfig = getServerConfig(formId);

  // Step 1: Validate schema (Type 1)
  const schemaValidation = await validateSchema(config.schema, formData);
  if (schemaValidation.status === 'fail') {
    return schemaValidation;
  }

  // Step 2: Validate data (Type 2) using server registry
  const dataValidation = await validateData(serverConfig.dataValidation, formData);
  if (dataValidation.status === 'fail') {
    return dataValidation;
  }

  // Step 3: Execute action (business logic) from server registry
  return await serverConfig.action(formData);
}
