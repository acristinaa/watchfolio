import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-check auth even though middleware handles it
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
