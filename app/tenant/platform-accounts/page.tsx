export default function PlatformAccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Accounts</h1>
        <p className="text-sm text-slate-500">
          Connect and manage your YouTube, TikTok, and Facebook Reels accounts (spec Section 6.4 & 9).
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-sm text-slate-600">
        Connected OAuth accounts, token validation, and channel linkings will be managed here.
      </div>
    </div>
  );
}
