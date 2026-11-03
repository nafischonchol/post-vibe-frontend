"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  Radio,
  Send,
  CheckCircle2,
  Clock,
  Gauge,
  Share2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { tenantApi } from "@/services/tenant-api";

interface DashboardData {
  videos: {
    total: number;
    ready: number;
    processing: number;
  };
  publishing: {
    scheduled_batches: number;
    published_batches: number;
    failed_uploads: number;
  };
  quotas: {
    date: string;
    global: {
      limit: number;
      used: number;
      available: number;
    };
    platforms: Record<
      string,
      {
        limit: number;
        used: number;
        available: number;
      }
    >;
  };
  recent_activity: Array<{
    id: number;
    batch_status: string;
    created_at: string;
    video?: {
      title: string;
      source_platform: string;
    };
    schedules?: Array<{
      id: number;
      platform: string;
      upload_status: string;
    }>;
  }>;
}

interface PlatformAccount {
  id: number;
  platform: string;
  account_name: string;
  account_handle: string;
  status: string;
}

export default function TenantDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, accRes] = await Promise.all([
        tenantApi.getDashboard(),
        tenantApi.getPlatformAccounts().catch(() => ({ resources: [] })),
      ]);
      setData(dashRes.resources);
      setAccounts(accRes.resources || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getPlatformAccount = (platform: string) => {
    return accounts.find((a) => a.platform.toLowerCase() === platform.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tenant Dashboard</h1>
          <p className="text-sm text-slate-500">
            Monitor automated ingestion, AI metadata generation, and multi-platform publishing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboard}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/tenant/publishing">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchDashboard} className="text-rose-700 hover:bg-rose-100">
            Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Collected Videos
            </CardTitle>
            <Video className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : data?.videos?.total ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">From connected social sources</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Processing & AI
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {loading ? "..." : data?.videos?.processing ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Downloading, hashing & AI generation</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ready To Publish
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {loading ? "..." : data?.videos?.ready ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Metadata verified and ready</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Daily Quota Used
            </CardTitle>
            <Gauge className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {loading
                ? "..."
                : `${data?.quotas?.global?.used ?? 0} / ${data?.quotas?.global?.limit ?? 50}`}
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${
                    data?.quotas?.global?.limit
                      ? Math.min(
                          100,
                          Math.round(
                            ((data.quotas.global.used || 0) / data.quotas.global.limit) * 100
                          )
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Connected Platforms & Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Channels Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Publishing Channels</h2>
              <p className="text-xs text-slate-500">Status of connected destination accounts</p>
            </div>
            <Link href="/tenant/platform-accounts">
              <Button variant="ghost" size="sm" className="text-indigo-600 text-xs">
                Manage Accounts <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["YouTube", "TikTok", "Facebook"].map((platform) => {
              const acc = getPlatformAccount(platform);
              const isConnected = !!acc;
              return (
                <div
                  key={platform}
                  className="rounded-lg border border-slate-200/80 p-4 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{platform}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        isConnected
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {isConnected ? "Active" : "Not Linked"}
                    </span>
                  </div>

                  <div>
                    {isConnected ? (
                      <div>
                        <div className="text-xs font-medium text-slate-900 truncate">
                          {acc.account_name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {acc.account_handle || "@connected"}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No account linked</p>
                    )}
                  </div>

                  <Link href="/tenant/platform-accounts">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-7 border-slate-200 text-slate-600"
                    >
                      {isConnected ? "Configure" : "Connect"}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Quota Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Per-Platform Limits</h2>
            <p className="text-xs text-slate-500">Daily quota consumption by destination</p>
          </div>

          <div className="space-y-4">
            {["youtube", "tiktok", "facebook"].map((p) => {
              const info = data?.quotas?.platforms?.[p] || { limit: 10, used: 0, available: 10 };
              const pct = info.limit ? Math.min(100, Math.round((info.used / info.limit) * 100)) : 0;
              return (
                <div key={p} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 capitalize">{p}</span>
                    <span className="text-slate-500">
                      {info.used} / {info.limit} used
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 80 ? "bg-amber-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link href="/tenant/quota" className="text-xs font-medium text-indigo-600 hover:underline">
              View full quota reservation ledger →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Publishing Activity */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Publishing Batches</h2>
            <p className="text-xs text-slate-500">Together Publishing batch logs and executions</p>
          </div>
          <Link href="/tenant/publishing">
            <Button variant="ghost" size="sm" className="text-indigo-600 text-xs">
              View All Batches <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading recent batches...</div>
        ) : !data?.recent_activity || data.recent_activity.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No publishing activity yet. Go to Videos to create your first publishing batch.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
            {data.recent_activity.map((batch) => (
              <div key={batch.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Batch #{batch.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        batch.batch_status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : batch.batch_status === "scheduled"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : batch.batch_status === "failed"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {batch.batch_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Video: {batch.video?.title || "Untitled Video"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {batch.schedules?.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize"
                    >
                      {s.platform}: {s.upload_status}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
