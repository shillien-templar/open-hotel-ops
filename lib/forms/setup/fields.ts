import { z } from "zod";
import type { FormFields } from "@/types/forms";

export const fields = {
  secret: {
    type: "text",
    label: "Setup Secret",
    placeholder: "Enter setup secret",
    defaultValue: "",
    schema: z.string().min(1, "Setup secret is required"),
    dataValidation: async (value: unknown) => {
      const setupSecret = process.env.SETUP_SECRET;

      if (!setupSecret) {
        return "Setup secret not configured on server";
      }

      if (value !== setupSecret) {
        return "Invalid setup secret";
      }

      return null; // Valid
    },
  },

  email: {
    type: "text",
    label: "Email",
    placeholder: "admin@example.com",
    defaultValue: "",
    schema: z.string().email("Invalid email address"),
  },

  password: {
    type: "text",
    label: "Password",
    placeholder: "Enter password",
    defaultValue: "",
    schema: z.string().min(8, "Password must be at least 8 characters"),
  },

  confirmPassword: {
    type: "text",
    label: "Confirm Password",
    placeholder: "Confirm password",
    defaultValue: "",
    schema: z.string(),
    dataValidation: async (value: unknown, formData: Record<string, unknown>) => {
      if (value !== formData.password) {
        return "Passwords don't match";
      }
      return null; // Valid
    },
  },
} as const satisfies FormFields;
