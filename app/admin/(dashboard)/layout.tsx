export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin/layout/AdminShell";
import { getProfile } from "@/lib/api/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
