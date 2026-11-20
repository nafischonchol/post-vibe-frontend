"use client";

import { useEffect, useState } from "react";
import {
  Radio,
  Plus,
  Trash2,
  Pause,
  Play,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Video,
  Sparkles,
  CheckCircle2,
  DownloadCloud,
  Pencil,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { tenantApi } from "@/services/tenant-api";

interface VideoSource {
  id: number;
  name: string;
  platform: string;
  source_identifier: string;
  source_url: string;
  scan_frequency: number;
  status: "active" | "paused";
  last_scanned_at: string | null;
  videos_count: number;
  created_at: string;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New source form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "youtube",
    source_url: "https://youtube.com/@creator_channel",
    scan_frequency: 60,
  });

  // Edit source form modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSource, setEditingSource] = useState<VideoSource | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    platform: "youtube",
    source_url: "",
    scan_frequency: 60,
    status: "active" as "active" | "paused",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Instant Scraper state
  const [scanningSourceId, setScanningSourceId] = useState<number | null>(null);

  // Direct Video Scraper Modal State
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapedResult, setScrapedResult] = useState<any>(null);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tenantApi.getSources();
      setSources(res.resources || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load video sources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      const identifier = getSourceIdentifier(formData.source_url);

      await tenantApi.createSource({ ...formData, source_identifier: identifier });
      setShowAddModal(false);
      setFormData({
        name: "",
        platform: "youtube",
        source_url: "https://youtube.com/@creator_channel",
        scan_frequency: 60,
      });
      setSuccessMessage("Video source feed registered successfully.");
      await fetchSources();
    } catch (err: any) {
      setError(err?.message || "Failed to add video source.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    try {
      setIsScraping(true);
      setError(null);
      setScrapedResult(null);

      const res = await tenantApi.scrapeVideo(scrapeUrl.trim());
      setScrapedResult(res.resources);
      setSuccessMessage("Video successfully scraped and dispatched to ingestion pipeline!");
      setScrapeUrl("");
      await fetchSources();
    } catch (err: any) {
      setError(err?.message || "Failed to scrape video from URL.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleStatus = async (source: VideoSource) => {
    try {
      const nextStatus = source.status === "active" ? "paused" : "active";
      await tenantApi.updateSource(source.id, { status: nextStatus });
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update source status.");
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm("Are you sure you want to delete this source?")) return;
    try {
      await tenantApi.deleteSource(id);
      setSources((prev) => prev.filter((s) => s.id !== id));
      setSuccessMessage("Video source deleted.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete source.");
    }
  };

  const handleOpenEdit = (source: VideoSource) => {
    setEditingSource(source);
    setEditFormData({
      name: source.name,
      platform: source.platform,
      source_url: source.source_url,
      scan_frequency: source.scan_frequency,
      status: source.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;

    try {
      setIsEditing(true);
      setError(null);

      const identifier = getSourceIdentifier(editFormData.source_url);

      await tenantApi.updateSource(editingSource.id, {
        ...editFormData,
        source_identifier: identifier,
      });

      setShowEditModal(false);
      setEditingSource(null);
      setSuccessMessage("Video source updated successfully.");
      await fetchSources();
    } catch (err: any) {
      setError(err?.message || "Failed to update video source.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleInstantScrape = async (source: VideoSource) => {
    try {
      setScanningSourceId(source.id);
      setError(null);
      const res = await tenantApi.scanSource(source.id);
      setSuccessMessage(res?.message || `Instant scrape completed for ${source.name}.`);
      await fetchSources();
    } catch (err: any) {
      setError(err?.message || `Failed to scrape source ${source.name}.`);
    } finally {
      setScanningSourceId(null);
    }
  };

  const getSourceIdentifier = (url: string) => {
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.at(-1) || parsed.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Video Sources & Ingestion</h1>
          <p className="text-sm text-slate-500">
            Configure social channels, profiles, or directly scrape TikTok, YouTube Shorts, and Instagram Reels.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSources}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setScrapedResult(null);
              setShowScrapeModal(true);
            }}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium"
          >
            <DownloadCloud className="h-4 w-4 mr-1.5 text-indigo-600" />
            Scrape Video Link
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Channel Feed
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSuccessMessage(null)} className="text-emerald-800">
            Dismiss
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setError(null)} className="text-rose-700 hover:bg-rose-100">
            Dismiss
          </Button>
        </div>
      )}

      {/* Sources Table */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Monitored Ingestion Feeds
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Sources polled on regular intervals by background scanner workers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-medium">
                  <th className="py-3 px-4">Source Name</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Identifier / Target</th>
                  <th className="py-3 px-4">Scan Interval</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Videos Found</th>
                  <th className="py-3 px-4">Last Scanned</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sources.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No video sources added yet. Click &quot;Scrape Video Link&quot; or &quot;Add Channel Feed&quot; to begin.
                    </td>
                  </tr>
                ) : (
                  sources.map((source) => (
                    <tr key={source.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {source.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {source.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={source.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:underline max-w-[200px] truncate"
                        >
                          <span>{source.source_identifier}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        Every {source.scan_frequency} mins
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            source.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {source.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {source.videos_count || 0}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {source.last_scanned_at
                          ? new Date(source.last_scanned_at).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInstantScrape(source)}
                            disabled={scanningSourceId === source.id}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-amber-600 disabled:opacity-50"
                            title="Instant Video Scrape"
                          >
                            {scanningSourceId === source.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-600" />
                            ) : (
                              <Zap className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(source)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-800"
                            title={source.status === "active" ? "Pause" : "Resume"}
                          >
                            {source.status === "active" ? (
                              <Pause className="h-3.5 w-3.5" />
                            ) : (
                              <Play className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(source)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-indigo-600"
                            title="Edit Source"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSource(source.id)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600"
                            title="Delete Source"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scrape Single Video Link Modal */}
      {showScrapeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">Instant Video Scraper</h2>
              </div>
              <button
                onClick={() => setShowScrapeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste a public video or reel URL from TikTok, YouTube Shorts, or Instagram. The engine will scrape metadata, extract hashtags, resolve the media stream, and prepare AI syndication.
            </p>

            <form onSubmit={handleDirectScrape} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Video Link URL</Label>
                <Input
                  type="url"
                  placeholder="https://www.tiktok.com/@user/video/... or https://youtube.com/shorts/..."
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  required
                />
              </div>

              {scrapedResult && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs space-y-1">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Discovered: {scrapedResult.source_platform?.toUpperCase()} Video</span>
                  </div>
                  <p className="text-emerald-800 line-clamp-2">{scrapedResult.original_caption}</p>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    Status: {scrapedResult.processing_status}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScrapeModal(false)}
                  className="border-slate-200 text-slate-700"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isScraping}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {isScraping ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Scraping Content...
                    </>
                  ) : (
                    "Start Scraping"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Feed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Add Automated Video Feed</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Source Display Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. My Productivity Shorts"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Platform</Label>
                <SearchableSelect
                  options={[
                    { value: "youtube", label: "YouTube Shorts / Channel", badge: "YT" },
                    { value: "tiktok", label: "TikTok Feed / Account", badge: "TT" },
                    { value: "instagram", label: "Instagram Reels", badge: "IG" },
                    { value: "facebook", label: "Facebook Page / Reels", badge: "FB" },
                  ]}
                  value={formData.platform}
                  onChange={(val) => setFormData({ ...formData, platform: val })}
                  placeholder="Select Platform"
                  searchPlaceholder="Search platform..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Scan Frequency (Minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="1440"
                  value={formData.scan_frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, scan_frequency: parseInt(e.target.value) || 60 })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Target Channel / Feed URL</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/@channel"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {isSubmitting ? "Adding..." : "Add Source Feed"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Feed Modal */}
      {showEditModal && editingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Edit Video Feed</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSource(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSource} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Source Display Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. My Productivity Shorts"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Platform</Label>
                <SearchableSelect
                  options={[
                    { value: "youtube", label: "YouTube Shorts / Channel", badge: "YT" },
                    { value: "tiktok", label: "TikTok Feed / Account", badge: "TT" },
                    { value: "instagram", label: "Instagram Reels", badge: "IG" },
                    { value: "facebook", label: "Facebook Page / Reels", badge: "FB" },
                  ]}
                  value={editFormData.platform}
                  onChange={(val) => setEditFormData({ ...editFormData, platform: val })}
                  placeholder="Select Platform"
                  searchPlaceholder="Search platform..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Scan Frequency (Minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="1440"
                  value={editFormData.scan_frequency}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, scan_frequency: parseInt(e.target.value) || 60 })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Target Channel / Feed URL</Label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/@channel"
                  value={editFormData.source_url}
                  onChange={(e) => setEditFormData({ ...editFormData, source_url: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Status</Label>
                <SearchableSelect
                  options={[
                    { value: "active", label: "Active", badge: "LIVE" },
                    { value: "paused", label: "Paused", badge: "PAUSED" },
                  ]}
                  value={editFormData.status}
                  onChange={(val) =>
                    setEditFormData({
                      ...editFormData,
                      status: val as "active" | "paused",
                    })
                  }
                  placeholder="Select Status"
                  searchPlaceholder="Search status..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSource(null);
                  }}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isEditing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {isEditing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
