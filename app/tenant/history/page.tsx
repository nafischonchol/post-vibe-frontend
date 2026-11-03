export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publishing History</h1>
        <p className="text-sm text-slate-500">
          Historical log of all completed and partially failed syndication batches (spec Section 12).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Execution logs, platform post IDs, and error retry details will be displayed here.
      </div>
    </div>
  );
}
