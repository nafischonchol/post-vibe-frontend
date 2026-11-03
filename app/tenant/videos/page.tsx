export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Video Management</h1>
        <p className="text-sm text-slate-500">
          Collected videos pipeline, original captions, and processing statuses (spec Section 6.3 & 7).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Video thumbnails, captions, download statuses, and AI analysis tags will be displayed here.
      </div>
    </div>
  );
}
