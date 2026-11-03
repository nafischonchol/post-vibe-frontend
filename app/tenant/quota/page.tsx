"use client";

import { useEffect, useState } from "react";
import {
  Gauge,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { tenantApi } from "@/services/tenant-api";

interface QuotaData {
  quota_date: string;
  timezone: string;
  global: {
    limit: number;
    reserved: number;
    published: number;
    failed: number;
    available: number;
  };
  platforms: Record<
    string,
    {
      limit: number;
      reserved: number;
      published: number;
      failed: number;
      available: number;
    }
  >;
}

interface QuotaHistoryItem {
  id: number;
  quota_date: string;
  quota_limit: number;
  reserved_count: number;
  published_count: number;
  failed_count: number;
}

export default function QuotaPage() {
  const [data, setData] = useState<QuotaData | null>(null);
  const [history, setHistory] = useState<QuotaHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quotaRes, histRes] = await Promise.all([
        tenantApi.getQuota(),
        tenantApi.getQuotaHistory().catch(() => ({ resources: [] })),
      ]);
      setData(quotaRes.resources);
      setHistory(histRes.resources || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load quota details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotaData();
  }, []);

  const globalUsed = (data?.global.published || 0) + (data?.global.reserved || 0);
  const globalPct = data?.global.limit
    ? Math.min(100, Math.round((globalUsed / data.global.limit) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quota & Ledger</h1>
          <p className="text-sm text-slate-500">
            Real-time daily quota consumption, atomic reservations, and timezone resets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuotaData}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchQuotaData} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Global Quota Progress Banner */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Global Daily Video Quota
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Workspace reset cycle: {data?.quota_date || "Today"} ({data?.timezone || "UTC"})
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">
                {loading ? "..." : `${globalUsed} / ${data?.global.limit ?? 50}`}
              </span>
              <div className="text-[11px] text-slate-400">
                {data?.global.available ?? 0} videos remaining
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
            {/* Published portion (emerald) */}
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${
                  data?.global.limit
                    ? Math.round(((data.global.published || 0) / data.global.limit) * 100)
                    : 0
                }%`,
              }}
              title={`Published: ${data?.global.published || 0}`}
            />
            {/* Reserved in-flight portion (amber) */}
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{
                width: `${
                  data?.global.limit
                    ? Math.round(((data.global.reserved || 0) / data.global.limit) * 100)
                    : 0
                }%`,
              }}
              title={`Reserved (In-flight): ${data?.global.reserved || 0}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" />
                Published ({data?.global.published ?? 0})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                Reserved ({data?.global.reserved ?? 0})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200 inline-block" />
                Available ({data?.global.available ?? 0})
              </span>
            </div>
            <span className="text-slate-400">{globalPct}% consumed</span>
          </div>
        </CardContent>
      </Card>

      {/* Per Platform Allowances */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Per-Platform Daily Limits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["youtube", "tiktok", "facebook"].map((p) => {
            const pData = data?.platforms?.[p] || {
              limit: 10,
              published: 0,
              reserved: 0,
              available: 10,
            };
            const pUsed = pData.published + pData.reserved;
            const pPct = pData.limit ? Math.min(100, Math.round((pUsed / pData.limit) * 100)) : 0;

            return (
              <Card key={p} className="border-slate-200 shadow-xs bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold capitalize text-slate-900">
                      {p}
                    </CardTitle>
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {pUsed} / {pData.limit}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pPct > 80 ? "bg-amber-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${pPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Published: {pData.published}</span>
                    <span>Reserved: {pData.reserved}</span>
                    <span className="font-medium text-emerald-700">
                      Available: {pData.available}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quota Architecture & Lock Policy Info */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900">
            Pessimistic Locking & Reservation Integrity
          </span>
          <p className="text-slate-500 leading-relaxed">
            All syndication requests perform row-level locking (<code>SELECT ... FOR UPDATE</code>) on tenant quota balances in strict sorted order to avoid deadlocks. Quota is reserved upon batch submission and only marked consumed upon successful publication confirmation.
          </p>
        </div>
      </div>

      {/* 30-Day Historical Table */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            30-Day Usage History
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Historical audit log of daily video quota consumption.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No historical records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Daily Limit</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4">Reserved</th>
                    <th className="py-3 px-4">Failed</th>
                    <th className="py-3 px-4 text-right">Available Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((h) => {
                    const avail = Math.max(0, h.quota_limit - h.reserved_count - h.published_count);
                    return (
                      <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-900">
                          {h.quota_date}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{h.quota_limit}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-emerald-700">
                          {h.published_count}
                        </td>
                        <td className="py-3 px-4 text-xs text-amber-700">{h.reserved_count}</td>
                        <td className="py-3 px-4 text-xs text-rose-600">{h.failed_count}</td>
                        <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-slate-900">
                          {avail}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
