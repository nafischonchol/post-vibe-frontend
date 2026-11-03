export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <p className="text-sm text-slate-500">
          Manage tenant members, roles, and permissions (Owner, Admin, Editor, Viewer - spec Section 4.2).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Team member list and invitation controls will be managed here.
      </div>
    </div>
  );
}
