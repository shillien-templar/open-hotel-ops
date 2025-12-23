import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Alert as AlertType } from "@/lib/types/alert";
import { Spinner } from "@/components/ui/spinner";

interface FormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  alert?: AlertType | null;
  children: ReactNode;
  className?: string;
}

export function Form({ form, onSubmit, alert, children, className }: FormProps) {
  return (
    <div className={className}>
      {alert && (
        <Alert variant={alert.variant} className="mb-4">
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && (
            <AlertDescription>{alert.description}</AlertDescription>
          )}
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        {form.formState.isSubmitting && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <Spinner className="size-8" />
          </div>
        )}

        <div className={form.formState.isSubmitting ? "opacity-50" : ""}>
          {children}
        </div>
      </form>
    </div>
  );
}
