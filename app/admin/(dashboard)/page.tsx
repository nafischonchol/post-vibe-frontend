import {
  Building2,
  Video,
  Layers,
  CheckCircle2,
  XCircle,
  Cpu,
  HardDrive,
  Clock,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";

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
  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Admin Overview"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
      />

      {/* Primary SaaS KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value="0"
          description="Active multi-tenant accounts"
          icon={Building2}
          badge="0 Active"
        />
        <StatCard
          title="Videos Ingested"
          value="0"
          description="Total collected across sources"
          icon={Video}
        />
        <StatCard
          title="Publishing Batches"
          value="0"
          description="Active & completed batches"
          icon={Layers}
        />
        <StatCard
          title="AI Token Consumption"
          value="0"
          description="OpenRouter / Gemini tokens"
          icon={Cpu}
        />
      </div>

      {/* Infrastructure & Pipeline Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Successful Uploads"
          value="0"
          description="Published to YT, TikTok, Reels"
          icon={CheckCircle2}
        />
        <StatCard
          title="Failed Uploads"
          value="0"
          description="Failures requiring reconciliation"
          icon={XCircle}
        />
        <StatCard
          title="Temporary S3 Storage"
          value="0 MB"
          description="Active media awaiting syndicate"
          icon={HardDrive}
        />
        <StatCard
          title="Queue Backlog"
          value="0"
          description="Horizon pending / active jobs"
          icon={Clock}
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
              Laravel 12 / Sanctum
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Queue & Workers
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              Redis / Laravel Horizon
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Gateway
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              OpenRouter / Gemini
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
