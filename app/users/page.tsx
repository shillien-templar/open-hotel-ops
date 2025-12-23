import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/users/users-table";
import { CreateUserDialog } from "@/components/users/create-user-dialog";

export default async function UsersPage() {
  await requireAuth();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <CreateUserDialog />
      </div>
      <UsersTable data={users} />
    </div>
  );
}
