"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Spinner } from "@/components/ui/spinner";
import { Form } from "@/components/form";
import { config as setupConfig } from "@/lib/forms/setup";
import { submitForm, objectToFormData } from "@/lib/forms/utils";
import type { SetupFormData } from "@/lib/forms/setup/schema";
import type { Alert } from "@/lib/types/alert";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [adminExists, setAdminExists] = useState(false);
  const [hideForm, setHideForm] = useState(false);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupConfig.schema),
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/setup/check");
      const data = await response.json();

      if (data.adminExists) {
        setAdminExists(true);
        setAlert({
          variant: "destructive",
          title: "Super admin already exists",
          description: "Remove SETUP_SECRET from environment variables to continue using the application.",
        });
      }
    } catch (err) {
      setAlert({
        variant: "destructive",
        title: "Failed to check admin status",
        description: "An error occurred while checking the setup status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    setAlert(null);

    const formData = objectToFormData(data);
    const result = await submitForm("setup", formData);

    if (result.alert) {
      setAlert(result.alert);
    }

    if (result.status === "success") {
      setHideForm(true);
      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initial Setup</CardTitle>
          <CardDescription>
            Create your super admin account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit} alert={alert}>
            {!hideForm && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="secret">Setup Secret</FieldLabel>
                  <Input
                    id="secret"
                    type="password"
                    disabled={form.formState.isSubmitting || adminExists}
                    {...form.register("secret")}
                  />
                  {form.formState.errors.secret && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.secret.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    disabled={form.formState.isSubmitting || adminExists}
                    {...form.register("email")}
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
                    disabled={form.formState.isSubmitting || adminExists}
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={form.formState.isSubmitting || adminExists}
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || adminExists}
                >
                  {form.formState.isSubmitting ? "Creating..." : "Create Super Admin Account"}
                </Button>
              </FieldGroup>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
