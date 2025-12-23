import { z } from "zod";

export const schema = z.object({
  secret: z.string().min(1, "Setup secret is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SetupFormData = z.infer<typeof schema>;
