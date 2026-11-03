"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Video,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  FileCode,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { tenantApi } from "@/services/tenant-api";

interface VideoItem {
  id: number;
  title: string | null;
  original_caption: string;
  original_hashtags: string[];
  source_platform: string;
  source_url: string;
  duration_seconds: number;
  processing_status: string;
  thumbnail_url: string | null;
  created_at: string;
  source?: {
    name: string;
    platform: string;
  };
  platform_metadata?: Array<{
    platform: string;
    is_manually_edited: boolean;
  }>;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {
        page: page.toString(),
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await tenantApi.getVideos(params);
      setVideos(res.resources || []);
      if (res.meta) {
        setMeta({ total: res.meta.total, last_page: res.meta.last_page });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load video catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVideos();
  };

  const handleReprocess = async (id: number) => {
    try {
      await tenantApi.reprocessVideo(id);
      alert("Video re-queued for processing & metadata generation.");
      fetchVideos();
    } catch (err: any) {
      alert(err?.message || "Reprocess failed.");
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "published":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "downloading":
      case "stored":
      case "analyzing":
      case "generating_metadata":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Video Ingestion</h1>
          <p className="text-sm text-slate-500">
            Collected videos, processing pipelines, and syndication readiness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchVideos}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/tenant/sources">
            <Button size="sm" variant="outline" className="border-slate-200 text-slate-700">
              Manage Sources
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchVideos} className="text-rose-700 hover:bg-rose-100">
            Dismiss
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search captions or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-4">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="ready">Ready to Syndicate</option>
            <option value="published">Published</option>
            <option value="generating_metadata">Generating Metadata</option>
            <option value="downloading">Downloading</option>
            <option value="stored">Stored</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Videos List / Table */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No videos found matching your filter. Videos will appear here as crawlers poll your sources.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Video & Caption</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Metadata</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {videos.map((v) => {
                    const ytMeta = v.platform_metadata?.find((m) => m.platform === "youtube");
                    const ttMeta = v.platform_metadata?.find((m) => m.platform === "tiktok");
                    const fbMeta = v.platform_metadata?.find((m) => m.platform === "facebook");

                    return (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 max-w-sm">
                          <div className="font-semibold text-slate-900 text-xs truncate">
                            {v.title || "Video #" + v.id}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {v.original_caption || "(No original caption provided)"}
                          </p>
                          {v.original_hashtags && v.original_hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {v.original_hashtags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                            {v.source_platform}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                            {v.source?.name || "Direct Feed"}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs font-mono text-slate-600">
                          {formatDuration(v.duration_seconds)}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                              v.processing_status
                            )}`}
                          >
                            {v.processing_status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                ytMeta
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={ytMeta ? "YouTube Metadata Generated" : "Pending"}
                            >
                              YT
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                ttMeta
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={ttMeta ? "TikTok Metadata Generated" : "Pending"}
                            >
                              TT
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                fbMeta
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={fbMeta ? "Facebook Reels Metadata Generated" : "Pending"}
                            >
                              FB
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/tenant/metadata?video_id=${v.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs border-slate-200 text-indigo-600 hover:bg-indigo-50"
                              >
                                <FileCode className="h-3.5 w-3.5 mr-1" />
                                Metadata
                              </Button>
                            </Link>

                            <Link href={`/tenant/publishing?video_id=${v.id}`}>
                              <Button
                                size="sm"
                                className="h-7 px-2 text-xs bg-slate-900 hover:bg-slate-800 text-white"
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Syndicate
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReprocess(v.id)}
                              className="h-7 px-1.5 text-slate-400 hover:text-slate-700"
                              title="Reprocess Video & AI"
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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

      {/* Pagination Controls */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Total: {meta.total} videos</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="h-8 px-3"
            >
              Previous
            </Button>
            <span>
              Page {page} of {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => setPage(page + 1)}
              className="h-8 px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
