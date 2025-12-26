import { z } from 'zod'
import type { Alert } from '@/lib/types/alert'

/**
 * Field Types
 * Defines the UI component type for each field
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'file'
  | 'slider'
  | 'hidden'

/**
 * Data Validation Function
 * Type 2 validation - validates field value against actual data (secrets, DB, etc.)
 * Runs server-side only - lives in server-registry, NOT in field config
 */
export type FieldDataValidation<T = unknown> = (
  value: T,
  formData: Record<string, unknown>
) => Promise<string | null> | string | null  // Returns error message or null if valid

/**
 * Base Field Configuration
 * Common properties for all field types
 * NOTE: No dataValidation here - that lives in server-registry
 */
export interface BaseFieldConfig {
  type: FieldType
  label: string
  description?: string
  defaultValue: unknown
  schema: z.ZodTypeAny
  placeholder?: string
  className?: string
}

/**
 * Select Field Configuration
 * For dropdowns and radio groups
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'radio'
  variant?: 'default' | 'model-dialog'  // Variant for specialized select UIs
  options: Array<{
    value: string
    label: string
    description?: string
    pricingMultiplier?: number
    metadata?: Record<string, unknown>  // For additional data (width, height, exampleImage, etc.)
  }>
}

/**
 * Number Field Configuration
 * For numeric inputs and sliders
 */
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number' | 'slider'
  variant?: 'default' | 'stepper'  // Variant for specialized number inputs
  min?: number
  max?: number
  step?: number
  sliderSuffix?: string  // Suffix for slider display (e.g., "seconds")
  formula?: (value: number) => number  // Convert frontend display value to submission value
}

/**
 * Text Field Configuration
 * For text inputs and textareas
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'textarea'
  minLength?: number
  maxLength?: number
}

/**
 * File Validation Rules
 * Platform-agnostic validation rules for file uploads
 * Used to generate Zod schemas AND manual validation on backend
 */
export interface FileValidationRules {
  required?: boolean
  maxSize?: number  // in bytes
  allowedTypes?: readonly string[]  // MIME types (readonly to support as const)
  errorMessages?: {
    required?: string
    maxSize?: string
    allowedTypes?: string
  }
}

/**
 * File Field Configuration
 * For file uploads
 */
export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file'
  accept?: string  // HTML accept attribute (e.g., "image/*")
  validation?: FileValidationRules
}

/**
 * Hidden Field Configuration
 * For hidden inputs that store data not directly editable by user
 */
export interface HiddenFieldConfig extends BaseFieldConfig {
  type: 'hidden'
}

/**
 * Union of all field types
 */
export type FieldConfig =
  | SelectFieldConfig
  | NumberFieldConfig
  | TextFieldConfig
  | FileFieldConfig
  | HiddenFieldConfig

/**
 * Form Fields Definition
 * Record of field name to field configuration
 */
export type FormFields = Record<string, FieldConfig>

/**
 * Validation Response
 * Unified response type for both schema and data validation
 */
export type ValidationResponse =
  | {
      status: 'success'
    }
  | {
      status: 'fail'
      alert: Alert
      fieldErrors?: Record<string, string>
    }

/**
 * Form Config (Client-Safe)
 * Configuration for a form that can be safely imported on client
 * Actions and dataValidation live in server-registry
 */
export interface FormConfig<T = unknown> {
  fields: FormFields
  schema: z.ZodType<T>
}

