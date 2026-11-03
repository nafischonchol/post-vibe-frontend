import { PageHeader } from "@/components/admin/ui/page-header";

export default function PlansPage() {
  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Plan Management"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Plans" }]}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Plan configuration interface will be implemented here (spec Section 5.5).
      </div>
    </div>
  );
}
