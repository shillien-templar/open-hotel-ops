import { SetupFormFields } from "./setup-form";
import { CreateUserFormFields } from "./create-user-form";
import type { UseFormReturn } from "react-hook-form";

/**
 * Form field components registry
 * Maps form IDs to their specific field layout components
 */
export const formComponentRegistry: Record<
  string,
  React.ComponentType<{ form: UseFormReturn<any> }>
> = {
  setup: SetupFormFields,
  "create-user": CreateUserFormFields,
  // Add more form field components here as they are created
};
