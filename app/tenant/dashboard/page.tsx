import {
  Video,
  Radio,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tenant Dashboard</h1>
        <p className="text-sm text-slate-500">
          Monitor your video ingestion, AI metadata generation, and multi-platform syndication.
        </p>
      </div>

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
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-slate-500 mt-1">From connected sources</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Processing & AI
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-slate-500 mt-1">Analyzing & generating metadata</p>
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
            <div className="text-2xl font-bold text-emerald-700">0</div>
            <p className="text-xs text-slate-500 mt-1">Metadata verified</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Quota Used
            </CardTitle>
            <Gauge className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0 / 50</div>
            <p className="text-xs text-slate-500 mt-1">Global daily video quota</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Channels Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Publishing Channels Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-800">YouTube</span>
            <span className="text-xs text-slate-400">Not Connected</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-800">TikTok</span>
            <span className="text-xs text-slate-400">Not Connected</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-800">Facebook Reels</span>
            <span className="text-xs text-slate-400">Not Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
