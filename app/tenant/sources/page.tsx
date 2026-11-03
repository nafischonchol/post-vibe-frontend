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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
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

  // New source form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "youtube",
    source_identifier: "@creator_channel",
    source_url: "https://youtube.com/@creator_channel",
    scan_frequency: 60,
  });

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
      await tenantApi.createSource(formData);
      setShowAddModal(false);
      setFormData({
        name: "",
        platform: "youtube",
        source_identifier: "@creator_channel",
        source_url: "https://youtube.com/@creator_channel",
        scan_frequency: 60,
      });
      await fetchSources();
    } catch (err: any) {
      setError(err?.message || "Failed to add video source.");
    } finally {
      setIsSubmitting(false);
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
    } catch (err: any) {
      alert(err?.message || "Failed to delete source.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Video Sources</h1>
          <p className="text-sm text-slate-500">
            Configure social channels and pages to automatically discover and ingest content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSources}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Video Source
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchSources} className="text-rose-700 hover:bg-rose-100">
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
            Automated crawler queries sources on their designated scan frequency.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading sources...</div>
          ) : sources.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No video sources added yet. Click &quot;Add Video Source&quot; to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Source Name</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Identifier / Link</th>
                    <th className="py-3 px-4">Scan Rate</th>
                    <th className="py-3 px-4">Collected</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">ID #{s.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                          {s.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span>{s.source_identifier}</span>
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Every {s.scan_frequency} mins
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-800">
                        {s.videos_count || 0} videos
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                            s.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(s)}
                            className="h-8 px-2 text-slate-600 hover:text-slate-900"
                            title={s.status === "active" ? "Pause crawler" : "Resume crawler"}
                          >
                            {s.status === "active" ? (
                              <Pause className="h-3.5 w-3.5" />
                            ) : (
                              <Play className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSource(s.id)}
                            className="h-8 px-2 text-slate-400 hover:text-rose-600"
                            title="Delete source"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      {/* Add Source Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Add New Video Source</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Source Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Daily Tech Highlights"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Platform</Label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Scan Interval (Minutes)
                  </Label>
                  <Input
                    type="number"
                    min={15}
                    max={1440}
                    value={formData.scan_frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, scan_frequency: parseInt(e.target.value) || 60 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Channel Handle / Identifier
                </Label>
                <Input
                  type="text"
                  placeholder="@handle or channel ID"
                  value={formData.source_identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, source_identifier: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Source URL</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? "Adding..." : "Save Source"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
