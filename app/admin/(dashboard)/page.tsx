"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Video,
  Layers,
  CheckCircle2,
  XCircle,
  Cpu,
  Clock,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

interface AdminDashboardData {
  tenants: {
    total: number;
    active: number;
    suspended: number;
  };
  videos: {
    total: number;
    ready: number;
    processing: number;
  };
  publishing: {
    total_batches: number;
    published_batches: number;
    failed_batches: number;
    successful_uploads: number;
    failed_uploads: number;
    pending_uploads: number;
    success_rate: number;
  };
  ai: {
    total_tokens: number;
    estimated_cost: number;
  };
  system: {
    failed_jobs: number;
  };
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  badge?: string;
}) {
  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {(description || badge) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            {badge && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/50">
                {badge}
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getDashboard();
      setData(res.resources);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Admin Platform Overview"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboard}
          disabled={loading}
          className="border-slate-200 text-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchDashboard} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Primary SaaS KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Workspaces"
          value={loading ? "..." : data?.tenants?.total ?? 0}
          description={`${data?.tenants?.suspended ?? 0} suspended`}
          icon={Building2}
          badge={`${data?.tenants?.active ?? 0} Active`}
        />
        <StatCard
          title="Videos Ingested"
          value={loading ? "..." : data?.videos?.total ?? 0}
          description={`${data?.videos?.ready ?? 0} ready to syndicate`}
          icon={Video}
        />
        <StatCard
          title="Publishing Batches"
          value={loading ? "..." : data?.publishing?.total_batches ?? 0}
          description={`${data?.publishing?.published_batches ?? 0} published`}
          icon={Layers}
        />
        <StatCard
          title="AI Token Consumption"
          value={loading ? "..." : (data?.ai?.total_tokens ?? 0).toLocaleString()}
          description={`Est. $${(data?.ai?.estimated_cost ?? 0).toFixed(4)}`}
          icon={Cpu}
        />
      </div>

      {/* Infrastructure & Pipeline Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Successful Uploads"
          value={loading ? "..." : data?.publishing?.successful_uploads ?? 0}
          description="Direct platform publications"
          icon={CheckCircle2}
          badge={`${data?.publishing?.success_rate ?? 100}% rate`}
        />
        <StatCard
          title="Failed Uploads"
          value={loading ? "..." : data?.publishing?.failed_uploads ?? 0}
          description="Failed destination schedules"
          icon={XCircle}
        />
        <StatCard
          title="Pending In-Flight"
          value={loading ? "..." : data?.publishing?.pending_uploads ?? 0}
          description="Queued / uploading tasks"
          icon={Clock}
        />
        <StatCard
          title="Failed Queue Jobs"
          value={loading ? "..." : data?.system?.failed_jobs ?? 0}
          description="Dead-letter jobs requiring retry"
          icon={Activity}
        />
      </div>

      {/* System Health Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Platform Status
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Services Operational
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Backend API
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              Laravel 12 / Sanctum Guard
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Queue & Workers
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              Redis / Transactional Outbox
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Gateway
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              OpenRouter / Gemini (Batched Prompt)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
