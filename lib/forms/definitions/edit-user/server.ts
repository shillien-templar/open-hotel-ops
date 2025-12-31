import { prisma } from "@/lib/prisma";
import type { FieldDataValidation } from "@/types/forms";
import { formDataToObject } from "@/lib/forms/core/helpers";
import { usersActions } from "@/lib/content/users/actions";

/**
 * Server-side data validation for edit-user form
 * Similar to create-user but excludes current user from email uniqueness check
 */
export const dataValidation: Record<string, FieldDataValidation> = {
  email: async (value: unknown, formData: Record<string, unknown>) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: value as string },
    });

    // Allow if no user found or if it's the same user being edited
    if (!existingUser || existingUser.id === formData.id) {
      return null;
    }

    return "A user with this email already exists";
  },
};

/**
 * Edit user form action
 * Calls CRUD update action and transforms result to form response with alert
 */
export async function action(formData: FormData | Record<string, unknown>) {
  const data =
    formData instanceof FormData ? formDataToObject(formData) : formData;

  const { id, ...updateData } = data;
  const result = await usersActions.update(id as string, updateData);

  if (result.success) {
    return {
      status: "success" as const,
      alert: {
        variant: "success" as const,
        title: "User updated",
        description: "User updated successfully.",
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
