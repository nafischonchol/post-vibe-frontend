export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publishing Calendar</h1>
        <p className="text-sm text-slate-500">
          Visual scheduled batches and platform release timelines (spec Section 11).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Calendar view of upcoming video uploads and scheduled platform batches.
      </div>
    </div>
  );
}
