import { z } from "zod";
import type { FormFields } from "@/types/forms";

export const fields = {
  secret: {
    type: "text",
    label: "Setup Secret",
    placeholder: "Enter setup secret",
    defaultValue: "",
    schema: z.string().min(1, "Setup secret is required"),
  },

  email: {
    type: "text",
    label: "Email",
    placeholder: "admin@example.com",
    defaultValue: "",
    schema: z.string().email("Invalid email address"),
  },

  password: {
    type: "password",
    label: "Password",
    placeholder: "Enter password",
    defaultValue: "",
    schema: z.string().min(8, "Password must be at least 8 characters"),
  },

  confirmPassword: {
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm password",
    defaultValue: "",
    schema: z.string(),
  },
} as const satisfies FormFields;
