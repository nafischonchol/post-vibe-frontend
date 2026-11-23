"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { tenantApi } from "@/services/tenant-api";

interface BatchItem {
  id: number;
  batch_status: string;
  scheduled_at: string;
  video?: {
    id: number;
    title: string | null;
    original_caption: string;
  };
  schedules?: Array<{
    platform: string;
    upload_status: string;
  }>;
}

export default function CalendarPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
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
    fetchBatches();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Publishing Calendar
          </h1>
          <p className="text-sm text-slate-500">
            Scheduled release timelines and upcoming publishing batches.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBatches}
            disabled={loading}
            className="border-slate-200 text-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/tenant/publishing">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-1.5" />
              Schedule Batch
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar List View */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Upcoming & Recent Timeline
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Chronological view of publishing events across YouTube, TikTok, and Facebook.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading schedule...</div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No scheduled publishing batches. Go to Videos to schedule one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          Batch #{batch.id}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {batch.batch_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 max-w-md">
                        {batch.video?.title || batch.video?.original_caption || "Untitled Video"}
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {batch.scheduled_at
                            ? new Date(batch.scheduled_at).toLocaleString()
                            : "Immediate release"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {batch.schedules?.map((s, idx) => (
                      <span
                        key={idx}
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
        </CardContent>
      </Card>
    </div>
  );
}
