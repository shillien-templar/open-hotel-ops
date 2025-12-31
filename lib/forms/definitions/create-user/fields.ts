import { z } from "zod";
import type { FormFields } from "@/types/forms";

export const fields: FormFields = {
  name: {
    type: "text",
    label: "Name",
    defaultValue: "",
    schema: z.string().min(1, "Name is required"),
    placeholder: "John Doe",
  },
  email: {
    type: "text",
    label: "Email",
    defaultValue: "",
    schema: z.string().email(),
    placeholder: "user@example.com",
  },
  password: {
    type: "password-generate",
    label: "Password",
    defaultValue: "",
    schema: z.string().min(6, "Password must be at least 6 characters"),
    placeholder: "Enter or generate password",
  },
  role: {
    type: "select",
    label: "Role",
    defaultValue: "FRONT_DESK",
    schema: z.enum(["SUPER_ADMIN", "ADMIN", "FRONT_DESK", "HOUSEKEEPING"]),
    options: [
      {
        value: "SUPER_ADMIN",
        label: "Super Admin",
      },
      {
        value: "ADMIN",
        label: "Admin",
      },
      {
        value: "FRONT_DESK",
        label: "Front Desk",
      },
      {
        value: "HOUSEKEEPING",
        label: "Housekeeping",
      },
    ],
  },
};
