"use client";

import { useEffect, useState } from "react";
import {
  History as HistoryIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { tenantApi } from "@/services/tenant-api";

interface BatchItem {
  id: number;
  batch_status: string;
  trigger_type: string;
  created_at: string;
  video?: {
    id: number;
    title: string | null;
    original_caption: string;
  };
  schedules?: Array<{
    id: number;
    platform: string;
    upload_status: string;
    platform_post_url: string | null;
    error_message: string | null;
  }>;
}

export default function HistoryPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await tenantApi.getBatches();
      setBatches(res.resources || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Publishing History</h1>
          <p className="text-sm text-slate-500">
            Historical audit log of syndication runs, platform confirmation URLs, and execution metrics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHistory}
          disabled={loading}
          className="border-slate-200 text-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading history...</div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No historical syndication records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Batch ID & Video</th>
                    <th className="py-3 px-4">Completed Date</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Platform Results & Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 text-xs">
                          Batch #{batch.id}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {batch.video?.title || batch.video?.original_caption || "Video #" + batch.video?.id}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600">
                        {new Date(batch.created_at).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            batch.batch_status === "published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : batch.batch_status === "partially_published"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : batch.batch_status === "failed"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {batch.batch_status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {batch.schedules?.map((s) => (
                            <div key={s.id} className="flex items-center gap-2">
                              <span className="font-medium text-slate-700 capitalize w-16">
                                {s.platform}:
                              </span>
                              {s.platform_post_url ? (
                                <a
                                  href={s.platform_post_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  View Published Reel <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : s.error_message ? (
                                <span className="text-rose-600 text-[11px] truncate max-w-xs">
                                  {s.error_message}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">
                                  Status: {s.upload_status}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
