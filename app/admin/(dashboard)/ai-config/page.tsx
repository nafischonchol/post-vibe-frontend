import { PageHeader } from "@/components/admin/ui/page-header";

export default function AiConfigPage() {
  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="AI Configuration"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "AI Config" }]}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        AI Provider, OpenRouter / Gemini credentials, and model management interface (spec Section 5.3 & 5.4).
      </div>
    </div>
  );
}
