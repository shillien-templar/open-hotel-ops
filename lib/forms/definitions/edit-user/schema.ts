import { z } from "zod";
import { schema as createUserSchema } from "../create-user/schema";

export const schema = createUserSchema
  .omit({ password: true })
  .extend({ id: z.string().min(1, "User ID is required") });

export type EditUserFormData = z.infer<typeof schema>;
