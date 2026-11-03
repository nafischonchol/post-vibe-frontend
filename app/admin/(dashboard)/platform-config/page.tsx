import { PageHeader } from "@/components/admin/ui/page-header";

export default function PlatformConfigPage() {
  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Social Platform APIs"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Platform APIs" }]}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        YouTube, TikTok, and Facebook OAuth App credentials configuration (spec Section 5.7).
      </div>
    </div>
  );
}
