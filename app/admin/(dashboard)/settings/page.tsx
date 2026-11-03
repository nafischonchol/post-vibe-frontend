import { PageHeader } from "@/components/admin/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";

export default function SettingsPage() {
  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Admin Settings"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />
      <Card className="border-slate-200 shadow-xs">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure admin preferences and system parameters</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Admin settings configuration options will be managed here.
        </CardContent>
      </Card>
    </div>
  );
}
