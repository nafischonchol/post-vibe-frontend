export default function QuotaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quota & Usage</h1>
        <p className="text-sm text-slate-500">
          Global and platform-specific daily publishing quotas and usage tracking (spec Section 14).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Quota meter, daily reset times, and transaction reservations will be displayed here.
      </div>
    </div>
  );
}
