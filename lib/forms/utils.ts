import { formDataToObject, objectToFormData } from "./helpers";
import { getFormConfig } from "./registry";
import { validateSchema, validateData } from "./validation";

/**
 * Process Form
 * Universal form handler that orchestrates validation and action execution
 *
 * Flow:
 * 1. Get form config by ID
 * 2. Validate schema (Type 1)
 * 3. If schema valid, validate data (Type 2)
 * 4. If both valid, execute action
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

  // Convert FormData to object if needed
  const data = formData instanceof FormData ? formDataToObject(formData) : formData;

  // Step 1: Validate schema (Type 1)
  const schemaValidation = await validateSchema(config.schema, data);
  if (schemaValidation.status === 'fail') {
    return schemaValidation;
  }

  // Step 2: Validate data (Type 2)
  const dataValidation = await validateData(config.fields, data);
  if (dataValidation.status === 'fail') {
    return dataValidation;
  }

  // Step 3: Execute action (business logic)
  return await config.action(data);
}

/**
 * Client-side form submission helper
 */
export async function submitForm(formId: string, formData: FormData) {
  const response = await fetch(`/api/forms/${formId}`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export { objectToFormData, formDataToObject };
