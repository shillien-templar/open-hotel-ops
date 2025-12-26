import { FormRenderer } from "@/components/form-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SetupPage() {
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
          <FormRenderer
            formId="setup"
            submitButtonText="Create Super Admin Account"
          />
        </CardContent>
      </Card>
    </div>
  );
}
