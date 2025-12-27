import { requireAuth } from "@/lib/auth-helpers";

export default async function Home() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-4xl font-bold">Open Hotel Ops</h1>
        <p className="text-xl text-muted-foreground">
          Welcome, {session.user?.email}
        </p>
        <p className="text-muted-foreground">
          Overview panel coming soon...
        </p>
      </div>
    </div>
  );
}
