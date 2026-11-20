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
  Trash2,
  Loader2,
  Play,
  Download,
  DownloadCloud,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { tenantApi } from "@/services/tenant-api";

interface VideoItem {
  id: number;
  title: string | null;
  original_caption: string;
  original_hashtags: string[];
  source_platform: string;
  source_post_url?: string;
  source_url?: string;
  duration?: number;
  duration_seconds?: number;
  processing_status: string;
  thumbnail_url: string | null;
  temporary_storage_path?: string | null;
  is_downloaded?: boolean;
  playback_url?: string | null;
  file_size_bytes?: number | null;
  file_size_formatted?: string | null;
  source_published_at?: string | null;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Playback & Download State
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [downloadingVideoId, setDownloadingVideoId] = useState<number | null>(null);

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

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video? This action will permanently remove the video and its generated metadata.")) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      await tenantApi.deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setSuccessMessage("Video deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to delete video.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadNow = async (video: VideoItem) => {
    try {
      setDownloadingVideoId(video.id);
      setError(null);
      const res = await tenantApi.downloadVideoNow(video.id);
      setSuccessMessage("Video downloaded successfully!");
      if (res.resources) {
        setVideos((prev) =>
          prev.map((v) => (v.id === video.id ? { ...v, ...res.resources } : v))
        );
        if (playingVideo && playingVideo.id === video.id) {
          setPlayingVideo({ ...playingVideo, ...res.resources });
        }
      } else {
        await fetchVideos();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to download video media.");
    } finally {
      setDownloadingVideoId(null);
    }
  };

  const formatDuration = (seconds?: number | null) => {
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
            Collected videos, processing pipelines, and publishing readiness.
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

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:bg-emerald-100">
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

        <div className="w-52">
          <SearchableSelect
            size="sm"
            options={[
              { value: "", label: "All Statuses" },
              { value: "ready", label: "Ready to Publish", badge: "READY" },
              { value: "published", label: "Published", badge: "LIVE" },
              { value: "generating_metadata", label: "Generating Metadata" },
              { value: "downloading", label: "Downloading" },
              { value: "stored", label: "Stored" },
              { value: "failed", label: "Failed" },
            ]}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            placeholder="Filter Status..."
            searchPlaceholder="Search status..."
          />
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
                          <div className="flex items-start gap-3">
                            {v.thumbnail_url ? (
                              <button
                                type="button"
                                onClick={() => setPlayingVideo(v)}
                                className="relative shrink-0 w-14 h-18 rounded-md overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer group shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Click to play video"
                              >
                                <img
                                  src={v.thumbnail_url}
                                  alt={v.title || "Video thumbnail"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                                  <div className="h-6 w-6 rounded-full bg-white/95 group-hover:bg-white text-slate-900 flex items-center justify-center shadow-sm">
                                    <Play className="h-3 w-3 fill-slate-900 ml-0.5" />
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPlayingVideo(v)}
                                className="shrink-0 w-14 h-18 rounded-md bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200/80 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Click to play video"
                              >
                                <Play className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[9px] mt-1 font-medium text-slate-600">Play</span>
                              </button>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setPlayingVideo(v)}
                                  className="font-semibold text-slate-900 text-xs truncate hover:text-indigo-600 transition-colors text-left"
                                >
                                  {v.title || "Video #" + v.id}
                                </button>
                                {v.is_downloaded || v.temporary_storage_path ? (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                    Downloaded{v.file_size_formatted ? ` (${v.file_size_formatted})` : ""}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                                    Pending Download
                                  </span>
                                )}
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
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                            {v.source_platform}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                            {v.source?.name || "Direct Feed"}
                          </div>
                          {v.source_published_at && (
                            <div
                              className="text-[10px] text-slate-500 mt-0.5"
                              title={`Published at source: ${new Date(v.source_published_at).toLocaleString()}`}
                            >
                              {new Date(v.source_published_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-xs font-mono text-slate-600">
                          {formatDuration(v.duration ?? v.duration_seconds)}
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
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPlayingVideo(v)}
                              className="h-7 px-2 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium"
                              title="Play Video"
                            >
                              <Play className="h-3 w-3 mr-1 fill-indigo-600 text-indigo-600" />
                              Play
                            </Button>

                            <Link href={`/tenant/metadata?video_id=${v.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
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

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVideo(v.id)}
                              disabled={deletingId === v.id}
                              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Video"
                            >
                              {deletingId === v.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
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

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-slate-900 truncate">
                    {playingVideo.title || `Video #${playingVideo.id}`}
                  </h2>
                  <span className="capitalize px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                    {playingVideo.source_platform}
                  </span>
                  {playingVideo.is_downloaded || playingVideo.temporary_storage_path ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Downloaded
                      {playingVideo.file_size_formatted && ` (${playingVideo.file_size_formatted})`}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Pending Download
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {playingVideo.original_caption || "(No caption)"}
                </p>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded hover:bg-slate-100 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Video Content */}
            <div className="space-y-3">
              {playingVideo.is_downloaded || playingVideo.temporary_storage_path ? (
                <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-800">
                  <video
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    poster={playingVideo.thumbnail_url || undefined}
                    src={tenantApi.getVideoStreamUrl(playingVideo.id)}
                    className="w-full max-h-[58vh] object-contain rounded-lg"
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <DownloadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Media File Not Yet Downloaded
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      This video was discovered by the scanner but its media stream has not been downloaded to your storage yet.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownloadNow(playingVideo)}
                      disabled={downloadingVideoId === playingVideo.id}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                    >
                      {downloadingVideoId === playingVideo.id ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Downloading Video...
                        </>
                      ) : (
                        <>
                          <DownloadCloud className="h-3.5 w-3.5 mr-1.5" />
                          Download Video Now
                        </>
                      )}
                    </Button>
                    {(playingVideo.source_post_url || playingVideo.source_url) && (
                      <a
                        href={playingVideo.source_post_url || playingVideo.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="border-slate-200">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                          Watch on {playingVideo.source_platform}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Video Details & Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 text-slate-500 flex-wrap">
                  <span>
                    Duration: <strong className="text-slate-800 font-mono">{formatDuration(playingVideo.duration ?? playingVideo.duration_seconds ?? 0)}</strong>
                  </span>
                  {playingVideo.file_size_formatted && (
                    <span>
                      Size: <strong className="text-slate-800 font-mono">{playingVideo.file_size_formatted}</strong>
                    </span>
                  )}
                  {playingVideo.source_published_at && (
                    <span>
                      Published: <strong className="text-slate-800">{new Date(playingVideo.source_published_at).toLocaleDateString()}</strong>
                    </span>
                  )}
                  <span>
                    Status: <strong className="text-slate-800 uppercase">{playingVideo.processing_status}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(playingVideo.is_downloaded || playingVideo.temporary_storage_path) && (
                    <a
                      href={tenantApi.getVideoDownloadUrl(playingVideo.id)}
                      download
                      className="inline-flex items-center"
                    >
                      <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 text-slate-700">
                        <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                        Download MP4
                      </Button>
                    </a>
                  )}
                  {(playingVideo.source_post_url || playingVideo.source_url) && (
                    <a
                      href={playingVideo.source_post_url || playingVideo.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 text-slate-700">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                        Original Post
                      </Button>
                    </a>
                  )}
                  <Link href={`/tenant/publishing?video_id=${playingVideo.id}`}>
                    <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Publish Video
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
