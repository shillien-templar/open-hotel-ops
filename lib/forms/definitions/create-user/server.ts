import { prisma } from "@/lib/prisma";
import type { FieldDataValidation } from "@/types/forms";
import { formDataToObject } from "@/lib/forms/core/helpers";
import { usersActions } from "@/lib/content/users/actions";

/**
 * Server-side data validation for create-user form
 */
export const dataValidation: Record<string, FieldDataValidation> = {
  email: async (value: unknown) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: value as string },
    });

    if (existingUser) {
      return "A user with this email already exists";
    }

    return null;
  },
};

/**
 * Create user form action
 * Calls CRUD action and transforms result to form response with alert
 */
export async function action(formData: FormData | Record<string, unknown>) {
  const data =
    formData instanceof FormData ? formDataToObject(formData) : formData;

  const result = await usersActions.create(data);

  if (result.success) {
    return {
      status: "success" as const,
      alert: {
        variant: "success" as const,
        title: "User created",
        description: "User created successfully.",
      },
    };
  } else {
    return {
      status: "fail" as const,
      alert: {
        variant: "destructive" as const,
        title: result.error.title,
        description: result.error.description,
      },
    };
  }
}
