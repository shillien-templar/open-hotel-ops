"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserActionsCell } from "./user-actions-cell";
import { formatDistanceToNow } from "date-fns";
import { UserRole, getRoleLabel } from "@/lib/constants/roles";

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null;
      return <div>{name ?? "-"}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {getRoleLabel(role)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-muted-foreground">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
