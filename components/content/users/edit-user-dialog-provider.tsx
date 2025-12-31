"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { EditUserDialog } from "./edit-dialog";
import type { User } from "./columns";

interface EditUserDialogContextValue {
  openEditUserDialog: (user: User) => void;
}

const EditUserDialogContext = createContext<EditUserDialogContextValue | null>(null);

export function useEditUserDialog() {
  const context = useContext(EditUserDialogContext);
  if (!context) {
    throw new Error("useEditUserDialog must be used within EditUserDialogProvider");
  }
  return context;
}

export function EditUserDialogProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => setSelectedUser(null), 200);
    }
  };

  return (
    <EditUserDialogContext.Provider value={{ openEditUserDialog }}>
      {children}
      {selectedUser && (
        <EditUserDialog
          key={selectedUser.id}
          user={selectedUser}
          open={open}
          onOpenChange={handleOpenChange}
        />
      )}
    </EditUserDialogContext.Provider>
  );
}
