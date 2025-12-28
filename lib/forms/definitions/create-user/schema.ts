import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "FRONT_DESK", "HOUSEKEEPING"], {
    message: "Invalid role selected",
  }),
});

export type CreateUserFormData = z.infer<typeof schema>;
