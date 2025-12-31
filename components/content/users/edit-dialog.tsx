"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormRenderer } from "@/components/form-renderer";
import type { User } from "./columns";

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit User</AlertDialogTitle>
          <AlertDialogDescription>
            Update user details for {user.email}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormRenderer
          formId="edit-user"
          submitButtonText="Save Changes"
          onCancel={() => onOpenChange(false)}
          onSuccess={() => {
            setTimeout(() => onOpenChange(false), 2000);
          }}
          defaultValues={{
            id: user.id,
            name: user.name ?? "",
            email: user.email,
            role: user.role,
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
