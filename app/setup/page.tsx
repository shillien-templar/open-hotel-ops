import { FormRenderer } from "@/components/form-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SetupPage() {
  // Check if super admin already exists
  const superAdminExists = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initial Setup</CardTitle>
          <CardDescription>
            {superAdminExists
              ? "Setup already completed"
              : "Create your super admin account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {superAdminExists ? (
            <div className="space-y-4">
              <Alert variant="info">
                <AlertTitle>Setup Already Complete</AlertTitle>
                <AlertDescription>
                  A super admin account has already been created. Please remove the SETUP_SECRET environment variable and restart the server to enable login.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link href="/auth/signin">Go to Sign In</Link>
              </Button>
            </div>
          ) : (
            <FormRenderer
              formId="setup"
              submitButtonText="Create Super Admin Account"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
