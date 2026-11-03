export default function TenantSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tenant Settings</h1>
        <p className="text-sm text-slate-500">
          Configure tenant organization profile, notification webhooks, and default syndication preferences.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Tenant workspace settings configuration will be managed here.
      </div>
    </div>
  );
}
