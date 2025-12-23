import {requireGuest} from "@/lib/auth-helpers";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireGuest();

  return (
      <main className="flex grow-1 items-center">
          {children}
      </main>
  )
}
