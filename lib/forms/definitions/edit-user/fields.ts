import { z } from "zod";
import { fields as createUserFields } from "../create-user/fields";
import type { FormFields } from "@/types/forms";

// Omit password from create-user fields
const { password, ...sharedFields } = createUserFields;

export const fields: FormFields = {
  id: {
    type: "hidden",
    label: "User ID",
    defaultValue: "",
    schema: z.string().min(1, "User ID is required"),
  },
  ...sharedFields,
};
