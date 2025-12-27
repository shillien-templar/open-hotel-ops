import { z } from "zod";
import type { FormFields } from "@/types/forms";

export const fields: FormFields = {
  email: {
    type: "text",
    label: "Email",
    description: "Enter the user's email address",
    defaultValue: "",
    schema: z.string().email(),
    placeholder: "user@example.com",
  },
  role: {
    type: "select",
    label: "Role",
    description: "Select the user's role",
    defaultValue: "FRONT_DESK",
    schema: z.enum(["ADMIN", "FRONT_DESK", "HOUSEKEEPING"]),
    options: [
      {
        value: "ADMIN",
        label: "Admin",
        description: "Can create Front Desk and Housekeeping users",
      },
      {
        value: "FRONT_DESK",
        label: "Front Desk",
        description: "Manages check-ins and reservations",
      },
      {
        value: "HOUSEKEEPING",
        label: "Housekeeping",
        description: "Manages room cleaning and maintenance",
      },
    ],
  },
};
