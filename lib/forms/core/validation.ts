import { z } from "zod";
import { formDataToObject } from "./helpers";
import type { ValidationResponse, FieldDataValidation } from "@/types/forms";

export function validateFormData<T extends z.ZodType>(
  schema: T,
  data: FormData | Record<string, unknown>
): { status: "success"; data: z.infer<T> } | { status: "fail"; errors: Record<string, string> } {
  const obj = data instanceof FormData ? formDataToObject(data) : data;
  const result = schema.safeParse(obj);

  if (result.status === "success") {
    return { status: "success", data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { status: "fail", errors };
}

/**
 * Validate Schema (Type 1 Validation)
 * Validates form data against Zod schema for format/type checking
 */
export async function validateSchema(
  schema: z.ZodTypeAny,
  formData: unknown
): Promise<ValidationResponse> {
  try {
    const result = await schema.safeParseAsync(formData)

    if (!result.success) {
      // Convert Zod errors to field errors
      const fieldErrors: Record<string, string> = {}

      result.error.errors.forEach((error) => {
        const fieldName = error.path.join('.')
        if (fieldName) {
          fieldErrors[fieldName] = error.message
        }
      })

      return {
        status: 'fail',
        alert: {
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please check the form for errors and try again.',
        },
        fieldErrors,
      }
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Schema validation error:', error)
    return {
      status: 'fail',
      alert: {
        variant: 'destructive',
        title: 'Validation Error',
        description: 'An unexpected error occurred during validation.',
      },
    }
  }
}

/**
 * Validate Data (Type 2 Validation)
 * Validates form data against actual values (secrets, DB, etc.)
 * Runs field-level dataValidation functions from server registry
 */
export async function validateData(
  dataValidation: Record<string, FieldDataValidation>,
  formData: Record<string, unknown>
): Promise<ValidationResponse> {
  try {
    const fieldErrors: Record<string, string> = {}

    // Run all field-level data validations
    for (const [fieldName, validationFn] of Object.entries(dataValidation)) {
      const fieldValue = formData[fieldName]
      const errorMessage = await validationFn(fieldValue, formData)

      if (errorMessage) {
        fieldErrors[fieldName] = errorMessage
      }
    }

    // If any field validations failed, return error
    if (Object.keys(fieldErrors).length > 0) {
      return {
        status: 'fail',
        alert: {
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please check the form for errors and try again.',
        },
        fieldErrors,
      }
    }

    return { status: 'success' }
  } catch (error) {
    console.error('Data validation error:', error)
    return {
      status: 'fail',
      alert: {
        variant: 'destructive',
        title: 'Validation Error',
        description: 'An unexpected error occurred during validation.',
      },
    }
  }
}

