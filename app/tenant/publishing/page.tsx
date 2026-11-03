"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Ban,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Label } from "@/components/admin/ui/label";
import { tenantApi } from "@/services/tenant-api";

interface PublishingBatchItem {
  id: number;
  batch_status: string;
  trigger_type: string;
  scheduled_at: string;
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
    platform_account?: {
      account_name: string;
      account_handle: string;
    };
  }>;
}

interface VideoOption {
  id: number;
  title: string | null;
  original_caption: string;
  processing_status: string;
}

interface PlatformAccount {
  id: number;
  platform: string;
  account_name: string;
}

function PublishingManager() {
  const searchParams = useSearchParams();
  const initialVideoId = searchParams.get("video_id");

  const [batches, setBatches] = useState<PublishingBatchItem[]>([]);
  const [videos, setVideos] = useState<VideoOption[]>([]);
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Batch Modal
  const [showModal, setShowModal] = useState(!!initialVideoId);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(
    initialVideoId ? parseInt(initialVideoId) : null
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({
    youtube: true,
    tiktok: true,
    facebook: true,
  });
  const [scheduleMode, setScheduleMode] = useState<"immediate" | "scheduled">("immediate");
  const [scheduledAt, setScheduledAt] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [batchRes, vidRes, accRes] = await Promise.all([
        tenantApi.getBatches(),
        tenantApi.getVideos({ per_page: "50" }).catch(() => ({ resources: [] })),
        tenantApi.getPlatformAccounts().catch(() => ({ resources: [] })),
      ]);

      setBatches(batchRes.resources || []);
      const vids = vidRes.resources || [];
      setVideos(vids);
      setAccounts(accRes.resources || []);

      if (!selectedVideoId && vids.length > 0) {
        setSelectedVideoId(vids[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load publishing batches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoId) {
      alert("Please select a video.");
      return;
    }

    const targets = Object.keys(selectedPlatforms)
      .filter((p) => selectedPlatforms[p])
      .map((platform) => {
        const acc = accounts.find((a) => a.platform.toLowerCase() === platform.toLowerCase());
        return {
          platform,
          account_id: acc?.id,
        };
      });

    if (targets.length === 0) {
      alert("Please select at least one target platform.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await tenantApi.createBatch({
        video_id: selectedVideoId,
        targets,
        scheduled_at: scheduleMode === "scheduled" && scheduledAt ? scheduledAt : undefined,
      });

      setShowModal(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.message || "Failed to create publishing batch.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBatch = async (id: number) => {
    if (!confirm("Cancel this batch and release all reserved daily quotas?")) return;
    try {
      await tenantApi.cancelBatch(id);
      await fetchData();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel batch.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "partially_published":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Together Publishing
          </h1>
          <p className="text-sm text-slate-500">
            Atomically syndicate videos simultaneously across YouTube, TikTok, and Facebook Reels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
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
            New Publishing Batch
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setError(null)} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Batches Table */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Publishing Batches & Upload Executions
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Each batch groups concurrent platform uploads under an atomic quota reservation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading batches...</div>
          ) : batches.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No publishing batches yet. Click &quot;New Publishing Batch&quot; to syndicate a video.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Batch ID & Video</th>
                    <th className="py-3 px-4">Trigger</th>
                    <th className="py-3 px-4">Scheduled For</th>
                    <th className="py-3 px-4">Batch Status</th>
                    <th className="py-3 px-4">Target Schedules</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 text-xs truncate">
                          Batch #{batch.id}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {batch.video?.title || batch.video?.original_caption || "Video #" + batch.video?.id}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] font-mono capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {batch.trigger_type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600">
                        {batch.scheduled_at ? new Date(batch.scheduled_at).toLocaleString() : "Immediate"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            batch.batch_status
                          )}`}
                        >
                          {batch.batch_status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {batch.schedules?.map((s) => (
                            <span
                              key={s.id}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border capitalize ${
                                s.upload_status === "completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : s.upload_status === "failed"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              <span>{s.platform}</span>: <span>{s.upload_status}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {["scheduled", "pending"].includes(batch.batch_status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBatch(batch.id)}
                            className="h-7 px-2 text-xs text-slate-400 hover:text-rose-600"
                            title="Cancel batch & release quota"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Batch Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Launch Together Publishing
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Select Video</Label>
                <select
                  value={selectedVideoId || ""}
                  onChange={(e) => setSelectedVideoId(parseInt(e.target.value))}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                >
                  {videos.map((v) => (
                    <option key={v.id} value={v.id}>
                      #{v.id} - {v.title || v.original_caption?.slice(0, 45) || "Video #" + v.id} ({v.processing_status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Platforms Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Target Platforms</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "youtube", name: "YouTube" },
                    { id: "tiktok", name: "TikTok" },
                    { id: "facebook", name: "Facebook" },
                  ].map((p) => {
                    const active = selectedPlatforms[p.id];
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() =>
                          setSelectedPlatforms((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                        }
                        className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                          active
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${active ? "text-indigo-600" : "text-slate-300"}`}
                        />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timing */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Publishing Mode</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleMode("immediate")}
                    className={`p-2.5 rounded-lg border text-xs font-medium ${
                      scheduleMode === "immediate"
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Immediate Outbox Dispatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode("scheduled")}
                    className={`p-2.5 rounded-lg border text-xs font-medium ${
                      scheduleMode === "scheduled"
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Schedule for Later
                  </button>
                </div>

                {scheduleMode === "scheduled" && (
                  <div className="pt-2 space-y-1">
                    <Label className="text-[11px] text-slate-500">Pick date & time</Label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required={scheduleMode === "scheduled"}
                    />
                  </div>
                )}
              </div>

              {/* Atomic Quota Guarantee notice */}
              <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 text-[11px] text-indigo-900 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Atomic Quota Protection:</strong> 1 global video quota and 1 quota per target platform will be atomically locked. If any platform encounters a permanent error, unconsumed quota will be automatically released back to your balance.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {submitting ? "Reserving & Creating..." : "Launch Batch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublishingPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400">Loading publishing manager...</div>}>
      <PublishingManager />
    </Suspense>
  );
}
