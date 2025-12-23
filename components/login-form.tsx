"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
      <Card>
          <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                  Enter your email below to login to your account
              </CardDescription>
          </CardHeader>
          <CardContent>
              {error && (
                  <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                      <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              {...form.register("email")}
                              disabled={isLoading}
                          />
                          {form.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                  {form.formState.errors.email.message}
                              </p>
                          )}
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Input
                              id="password"
                              type="password"
                              {...form.register("password")}
                              disabled={isLoading}
                          />
                          {form.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                  {form.formState.errors.password.message}
                              </p>
                          )}
                      </Field>
                      <Field>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? "Logging in..." : "Login"}
                          </Button>
                      </Field>
                  </FieldGroup>
              </form>
          </CardContent>
      </Card>
  );
}
