import { requireMinRole } from "@/lib/auth-helpers";
import { ContentTable } from "@/components/content-table";
import { columns } from "@/components/content/users/columns";
import { CreateUserDialog } from "@/components/content/users/create-dialog";
import { EditUserDialogProvider } from "@/components/content/users/edit-user-dialog-provider";
import { UserRole } from "@/lib/constants/roles";

export default async function UsersPage() {
  await requireMinRole(UserRole.ADMIN);

  return (
    <EditUserDialogProvider>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <ContentTable
          columns={columns}
          contentType="users"
          searchPlaceholder="Search by email or name..."
          headerActions={<CreateUserDialog />}
        />
      </div>
    </EditUserDialogProvider>
  );
}
