"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Cpu,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

export default function MonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setData(res.resources);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Infrastructure & Queue Monitoring"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Monitoring" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHealth}
          disabled={loading}
          className="border-slate-200 text-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Horizon and Telescope Direct Jumpers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900">
                Laravel Horizon Dashboard
              </CardTitle>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                Redis Queue Supervisor
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Real-time job throughput, runtime metrics, supervisor processes, and queue balancing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="http://127.0.0.1:8000/horizon" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                Open Horizon Console <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900">
                Laravel Telescope Diagnostics
              </CardTitle>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                Telemetry & Profiler
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Deep dive into incoming requests, database queries, Redis caching, and exception stack traces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="http://127.0.0.1:8000/telescope" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 text-xs">
                Open Telescope Console <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status Breakdown */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Durable Processing Telemetry
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Operational statuses across the video syndication engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Transactional Outbox
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Active</span>
                <span className="text-xs text-emerald-600 font-mono">SKIP LOCKED Polling</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Publishing Success Rate
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  {data?.publishing?.success_rate ?? 100}%
                </span>
                <span className="text-xs text-slate-500">
                  {data?.publishing?.successful_uploads ?? 0} published
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dead-Letter Failed Jobs
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  {data?.system?.failed_jobs ?? 0}
                </span>
                <span className="text-xs text-slate-400">Database failed_jobs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
