"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormRenderer } from "@/components/form-renderer";
import { Plus } from "lucide-react";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New User</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new user to the system. A temporary password will be generated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormRenderer
          formId="create-user"
          submitButtonText="Create User"
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
