"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Shield,
  Clock,
  RefreshCw,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";

interface AuditLogItem {
  id: number;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string;
  ip_address: string;
  created_at: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([
    {
      id: 1,
      admin_email: "admin@gmail.com",
      action: "tenant.created",
      target_type: "Tenant",
      target_id: "Demo Studio (1)",
      ip_address: "127.0.0.1",
      created_at: "2026-11-03 16:30:00",
    },
    {
      id: 2,
      admin_email: "admin@gmail.com",
      action: "plan.updated",
      target_type: "Plan",
      target_id: "Pro (2)",
      ip_address: "127.0.0.1",
      created_at: "2026-11-03 16:35:12",
    },
    {
      id: 3,
      admin_email: "admin@gmail.com",
      action: "settings.updated",
      target_type: "SystemSetting",
      target_id: "video_content_analysis_enabled",
      ip_address: "127.0.0.1",
      created_at: "2026-11-03 16:40:05",
    },
  ]);

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Administrative Audit Trail"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Audit Logs" }]}
      />

      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Immutable Audit Trail
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Records all administrator actions, tenant suspensions, and quota overrides.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      {log.created_at}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-900">
                      {log.admin_email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700">
                      <span className="font-semibold text-slate-800">{log.target_type}:</span> {log.target_id}
                    </td>
                    <td className="py-3 px-4 text-right text-xs font-mono text-slate-400">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
