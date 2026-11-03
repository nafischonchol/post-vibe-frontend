"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { tenantApi } from "@/services/tenant-api";

interface PlatformAccount {
  id: number;
  platform: string;
  account_name: string;
  account_handle: string;
  avatar_url: string | null;
  status: string;
  token_expires_at: string | null;
  is_expiring: boolean;
  last_validated_at: string | null;
}

export default function PlatformAccountsPage() {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectForm, setConnectForm] = useState({
    platform: "youtube",
    account_name: "",
    account_handle: "",
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tenantApi.getPlatformAccounts();
      setAccounts(res.resources || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load platform accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await tenantApi.createPlatformAccount(connectForm);
      setShowModal(false);
      setConnectForm({ platform: "youtube", account_name: "", account_handle: "" });
      await fetchAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to link platform account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (id: number) => {
    if (!confirm("Are you sure you want to disconnect this platform account? Any pending schedules targeting this account will fail.")) return;
    try {
      await tenantApi.disconnectPlatformAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to disconnect account.");
    }
  };

  const platforms = [
    { id: "youtube", name: "YouTube Shorts / Channel", color: "text-red-600 bg-red-50 border-red-200" },
    { id: "tiktok", name: "TikTok Business / Creator", color: "text-slate-900 bg-slate-100 border-slate-300" },
    { id: "facebook", name: "Facebook Page / Reels", color: "text-blue-600 bg-blue-50 border-blue-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Destination Platform Accounts
          </h1>
          <p className="text-sm text-slate-500">
            Connect destination social accounts to syndicate short-form video reels and shorts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAccounts}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchAccounts} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Grid of 3 Major Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((p) => {
          const linked = accounts.filter((a) => a.platform.toLowerCase() === p.id);

          return (
            <Card key={p.id} className="border-slate-200 shadow-xs bg-white flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${p.color}`}>
                    {p.id}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {linked.length} linked
                  </span>
                </div>
                <CardTitle className="text-base font-semibold text-slate-900 mt-2">
                  {p.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Direct API publishing with automated token refresh.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                {linked.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No {p.id} accounts connected
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linked.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                      >
                        <div className="space-y-0.5 max-w-[170px]">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {acc.account_name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {acc.account_handle}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Valid Auth Token</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(acc.id)}
                          className="h-7 px-2 text-slate-400 hover:text-rose-600"
                          title="Disconnect"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConnectForm({ platform: p.id, account_name: "", account_handle: "" });
                      setShowModal(true);
                    }}
                    className="w-full text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Link {p.id.toUpperCase()} Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security & Token Policy Note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900">Encrypted Token Storage</span>
          <p className="text-slate-500 leading-relaxed">
            All OAuth access and refresh tokens are encrypted at rest using AES-256-CBC via Laravel&apos;s encryption layer. Scheduled background workers inspect token expiration and automatically trigger renewal prior to video publication.
          </p>
        </div>
      </div>

      {/* Connect Account Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Connect Platform Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Platform</Label>
                <select
                  value={connectForm.platform}
                  onChange={(e) => setConnectForm({ ...connectForm, platform: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook Reels</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Account / Channel Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Tech Studio"
                  value={connectForm.account_name}
                  onChange={(e) => setConnectForm({ ...connectForm, account_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Handle / Page Username</Label>
                <Input
                  type="text"
                  placeholder="@acmetech"
                  value={connectForm.account_handle}
                  onChange={(e) => setConnectForm({ ...connectForm, account_handle: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? "Linking..." : "Connect Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
