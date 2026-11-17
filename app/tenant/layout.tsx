import { TenantShell } from "@/components/tenant/layout/TenantShell";

export const metadata = {
  title: "Post-Vibe | Tenant Portal",
  description: "Automated Video Syndication Dashboard",
};

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantShell>{children}</TenantShell>;
}
