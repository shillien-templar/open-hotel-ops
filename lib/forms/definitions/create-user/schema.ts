import { z } from "zod";

export const schema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "FRONT_DESK", "HOUSEKEEPING"], {
    message: "Invalid role selected",
  }),
});

export type CreateUserFormData = z.infer<typeof schema>;
