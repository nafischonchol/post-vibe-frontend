export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Video Sources</h1>
        <p className="text-sm text-slate-500">
          Manage social media sources for automated video collection and ingestion (spec Section 6.2 & 7).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Source accounts & collection frequencies will be configured here.
      </div>
    </div>
  );
}
