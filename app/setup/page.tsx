"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const secretSchema = z.object({
  secret: z.string().min(1, "Setup secret is required"),
});

const adminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecretForm = z.infer<typeof secretSchema>;
type AdminForm = z.infer<typeof adminSchema>;

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState(false);
  const [secretValidated, setSecretValidated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<AdminForm | null>(null);

  const secretForm = useForm<SecretForm>({
    resolver: zodResolver(secretSchema),
  });

  const adminForm = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
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
        setError("Super admin account already exists. Remove SETUP_SECRET from environment variables to continue using the application.");
      }
    } catch (err) {
      setError("Failed to check admin status");
    } finally {
      setLoading(false);
    }
  };

  const onSecretSubmit = async (data: SecretForm) => {
    setError(null);
    try {
      const response = await fetch("/api/setup/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || "Invalid setup secret");
        return;
      }

      setSecretValidated(true);
    } catch (err) {
      setError("Failed to validate secret");
    }
  };

  const onAdminSubmit = async (data: AdminForm) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const confirmAdminCreation = async () => {
    if (!pendingData) return;

    setError(null);
    setShowConfirmDialog(false);

    try {
      const response = await fetch("/api/setup/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: secretForm.getValues("secret"),
          email: pendingData.email,
          password: pendingData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.error || "Failed to create admin account");
        return;
      }

      router.push("/auth/signin");
    } catch (err) {
      setError("Failed to create admin account");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!adminExists && !secretValidated && (
            <form onSubmit={secretForm.handleSubmit(onSecretSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="secret">Setup Secret</FieldLabel>
                  <Input
                    id="secret"
                    type="password"
                    {...secretForm.register("secret")}
                  />
                  {secretForm.formState.errors.secret && (
                    <p className="text-sm text-red-500">
                      {secretForm.formState.errors.secret.message}
                    </p>
                  )}
                </Field>
                <Button type="submit" className="w-full">
                  Validate Secret
                </Button>
              </FieldGroup>
            </form>
          )}

          {!adminExists && secretValidated && (
            <form onSubmit={adminForm.handleSubmit(onAdminSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...adminForm.register("email")}
                  />
                  {adminForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {adminForm.formState.errors.email.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...adminForm.register("password")}
                  />
                  {adminForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {adminForm.formState.errors.password.message}
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
                    {...adminForm.register("confirmPassword")}
                  />
                  {adminForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {adminForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </Field>
                <Button type="submit" className="w-full">
                  Create Super Admin Account
                </Button>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Super Admin Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create the super admin account with email{" "}
              <strong>{pendingData?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAdminCreation}>
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
