import { z } from 'zod'
import {FormFields} from "@/types/forms";

/**
 * Converts FormData to a plain object
 */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    if (obj[key] !== undefined) {
      // Handle multiple values for same key
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      (obj[key] as unknown[]).push(value);
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

/**
 * Converts a plain object to FormData
 */
export function objectToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, String(item));
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Builds a Zod schema from field definitions
 *
 * @param fields - Feature field definitions
 * @returns Zod object schema
 *
 * @example
 * const schema = buildSchema(IMAGE_GEN_FIELDS)
 */
export function buildSchema<T extends FormFields>(fields: T) {
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  for (const [key, field] of Object.entries(fields)) {
    schemaShape[key] = field.schema
  }

  return z.object(schemaShape)
}
