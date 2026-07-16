import { createClient } from "@/lib/supabaseServer";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Role is read from trusted app_metadata (server-side only)
  const role: string = user?.app_metadata?.role ?? "unknown";

  return (
    <div className="bg-black min-h-screen">
      <Sidebar role={role} />
      <div className="ml-[280px]">{children}</div>
    </div>
  );
}