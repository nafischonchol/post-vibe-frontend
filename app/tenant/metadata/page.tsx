"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Save,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Video,
  FileCode,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { tenantApi } from "@/services/tenant-api";

interface PlatformMetadata {
  id: number;
  platform: string;
  title: string | null;
  description: string | null;
  caption: string | null;
  tags: string[];
  hashtags: string[];
  is_manually_edited: boolean;
  generation_status: string;
}

interface VideoDetail {
  id: number;
  title: string | null;
  original_caption: string;
  original_hashtags: string[];
  source_platform: string;
  duration_seconds: number;
  processing_status: string;
  analysis_result?: {
    summary: string;
    detected_topics: string[];
  };
}

function MetadataEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoIdParam = searchParams.get("video_id");

  const [videos, setVideos] = useState<VideoDetail[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(
    videoIdParam ? parseInt(videoIdParam) : null
  );
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [metadata, setMetadata] = useState<Record<string, PlatformMetadata>>({});
  const [activeTab, setActiveTab] = useState<"youtube" | "tiktok" | "facebook">("youtube");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states per platform
  const [ytForm, setYtForm] = useState({ title: "", description: "", tags: "" });
  const [ttForm, setTtForm] = useState({ caption: "", hashtags: "" });
  const [fbForm, setFbForm] = useState({ caption: "", hashtags: "" });

  // Initial load: videos list if none selected
  useEffect(() => {
    tenantApi.getVideos({ per_page: "20" }).then((res) => {
      const list = res.resources || [];
      setVideos(list);
      if (!selectedVideoId && list.length > 0) {
        setSelectedVideoId(list[0].id);
      }
    }).catch(() => {});
  }, []);

  // When selectedVideoId changes, load video and metadata
  useEffect(() => {
    if (!selectedVideoId) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    Promise.all([
      tenantApi.getVideo(selectedVideoId),
      tenantApi.getVideoMetadata(selectedVideoId),
    ])
      .then(([vidRes, metaRes]) => {
        const vid = vidRes.resources;
        setVideo(vid);
        const meta = metaRes.resources || {};
        setMetadata(meta);

        // Populate forms
        if (meta.youtube) {
          setYtForm({
            title: meta.youtube.title || "",
            description: meta.youtube.description || "",
            tags: (meta.youtube.tags || []).join(", "),
          });
        } else {
          setYtForm({ title: vid.title || "", description: vid.original_caption || "", tags: "" });
        }

        if (meta.tiktok) {
          setTtForm({
            caption: meta.tiktok.caption || "",
            hashtags: (meta.tiktok.hashtags || []).join(" "),
          });
        } else {
          setTtForm({
            caption: vid.original_caption || "",
            hashtags: (vid.original_hashtags || []).join(" "),
          });
        }

        if (meta.facebook) {
          setFbForm({
            caption: meta.facebook.caption || "",
            hashtags: (meta.facebook.hashtags || []).join(" "),
          });
        } else {
          setFbForm({
            caption: vid.original_caption || "",
            hashtags: (vid.original_hashtags || []).join(" "),
          });
        }
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to load video metadata.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedVideoId]);

  const handleSavePlatform = async (platform: "youtube" | "tiktok" | "facebook") => {
    if (!selectedVideoId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      let payload: Record<string, any> = {};
      if (platform === "youtube") {
        payload = {
          title: ytForm.title,
          description: ytForm.description,
          tags: ytForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        };
      } else if (platform === "tiktok") {
        payload = {
          caption: ttForm.caption,
          hashtags: ttForm.hashtags.split(" ").map((t) => t.trim()).filter(Boolean),
        };
      } else if (platform === "facebook") {
        payload = {
          caption: fbForm.caption,
          hashtags: fbForm.hashtags.split(" ").map((t) => t.trim()).filter(Boolean),
        };
      }

      const res = await tenantApi.updateVideoMetadata(selectedVideoId, platform, payload);
      setMetadata((prev) => ({ ...prev, [platform]: res.resources }));
      setSuccessMsg(`Successfully saved metadata for ${platform.toUpperCase()}`);
    } catch (err: any) {
      setError(err?.message || `Failed to save metadata for ${platform}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedVideoId) return;
    if (!confirm("Regenerate batched AI metadata for all platforms? This will update YouTube, TikTok, and Facebook simultaneously.")) return;

    try {
      setRegenerating(true);
      setError(null);
      setSuccessMsg(null);
      const res = await tenantApi.regenerateVideoMetadata(selectedVideoId);
      const updated = res.resources || {};
      setMetadata(updated);

      if (updated.youtube) {
        setYtForm({
          title: updated.youtube.title || "",
          description: updated.youtube.description || "",
          tags: (updated.youtube.tags || []).join(", "),
        });
      }
      if (updated.tiktok) {
        setTtForm({
          caption: updated.tiktok.caption || "",
          hashtags: (updated.tiktok.hashtags || []).join(" "),
        });
      }
      if (updated.facebook) {
        setFbForm({
          caption: updated.facebook.caption || "",
          hashtags: (updated.facebook.hashtags || []).join(" "),
        });
      }

      setSuccessMsg("AI metadata regenerated cleanly with 60-70% token savings!");
    } catch (err: any) {
      setError(err?.message || "Failed to regenerate AI metadata.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Metadata Editor
          </h1>
          <p className="text-sm text-slate-500">
            Platform-specific copywriting, tags, and hashtag optimization for multi-channel syndication.
          </p>
        </div>

        {selectedVideoId && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating || loading}
              className="border-slate-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Sparkles className={`h-4 w-4 mr-1.5 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "Regenerating..." : "Regenerate with AI"}
            </Button>
            <Link href={`/tenant/publishing?video_id=${selectedVideoId}`}>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                <Send className="h-4 w-4 mr-1.5" />
                Proceed to Syndicate
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Video Selector Dropdown if multiple videos available */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
        <span className="font-semibold text-slate-700">Target Video:</span>
        <select
          value={selectedVideoId || ""}
          onChange={(e) => {
            const id = parseInt(e.target.value);
            setSelectedVideoId(id);
            router.push(`/tenant/metadata?video_id=${id}`);
          }}
          className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 max-w-md"
        >
          {videos.map((v) => (
            <option key={v.id} value={v.id}>
              #{v.id} - {v.title || v.original_caption?.slice(0, 40) || "Video #" + v.id} ({v.source_platform})
            </option>
          ))}
        </select>
        <Link href="/tenant/videos" className="text-indigo-600 hover:underline flex items-center gap-1">
          Catalog <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setError(null)} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Video Context Summary */}
      {video && (
        <Card className="border-slate-200 shadow-xs bg-slate-50/50">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Original Source: {video.source_platform}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Duration: {video.duration_seconds || 0}s
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {video.original_caption || "(No caption provided)"}
              </p>
              {video.analysis_result?.summary && (
                <div className="mt-2 text-xs text-slate-500 bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-semibold text-slate-700">AI Video Summary:</span>{" "}
                  {video.analysis_result.summary}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Tabs & Editors */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 gap-2">
          {[
            { id: "youtube", label: "YouTube Shorts / Video" },
            { id: "tiktok", label: "TikTok" },
            { id: "facebook", label: "Facebook Reels" },
          ].map((tab) => {
            const isEdited = metadata[tab.id]?.is_manually_edited;
            const isGenerated = !!metadata[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {isEdited ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Edited
                  </span>
                ) : isGenerated ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Ready
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab 1: YouTube */}
        {activeTab === "youtube" && (
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    YouTube Metadata
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Optimized title (under 100 chars), rich SEO description, and search tags.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSavePlatform("youtube")}
                  disabled={saving || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save YouTube
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-slate-700">Video Title</Label>
                  <span className="text-[11px] text-slate-400">{ytForm.title.length} / 100</span>
                </div>
                <Input
                  type="text"
                  maxLength={100}
                  value={ytForm.title}
                  onChange={(e) => setYtForm({ ...ytForm, title: e.target.value })}
                  placeholder="Catchy, high CTR title..."
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-slate-700">Description</Label>
                  <span className="text-[11px] text-slate-400">
                    {ytForm.description.length} / 5000
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={ytForm.description}
                  onChange={(e) => setYtForm({ ...ytForm, description: e.target.value })}
                  className="w-full rounded-md border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="Full video description with links, chapters, and hashtags..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Tags (comma-separated)</Label>
                <Input
                  type="text"
                  value={ytForm.tags}
                  onChange={(e) => setYtForm({ ...ytForm, tags: e.target.value })}
                  placeholder="tech, gadgets, review, viral, shorts"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: TikTok */}
        {activeTab === "tiktok" && (
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    TikTok Metadata
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Engaging short-form hook caption and viral hashtags (under 2200 chars).
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSavePlatform("tiktok")}
                  disabled={saving || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save TikTok
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-slate-700">TikTok Caption</Label>
                  <span className="text-[11px] text-slate-400">{ttForm.caption.length} / 2200</span>
                </div>
                <textarea
                  rows={4}
                  value={ttForm.caption}
                  onChange={(e) => setTtForm({ ...ttForm, caption: e.target.value })}
                  className="w-full rounded-md border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="Viral hook caption..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Hashtags (space-separated)</Label>
                <Input
                  type="text"
                  value={ttForm.hashtags}
                  onChange={(e) => setTtForm({ ...ttForm, hashtags: e.target.value })}
                  placeholder="#fyp #foryou #tech #viral"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Facebook Reels */}
        {activeTab === "facebook" && (
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Facebook Reels Metadata
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Conversational caption with question hooks and community hashtags.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSavePlatform("facebook")}
                  disabled={saving || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Facebook
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Reel Caption</Label>
                <textarea
                  rows={4}
                  value={fbForm.caption}
                  onChange={(e) => setFbForm({ ...fbForm, caption: e.target.value })}
                  className="w-full rounded-md border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="Did you know this? Let us know in the comments..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Hashtags (space-separated)</Label>
                <Input
                  type="text"
                  value={fbForm.hashtags}
                  onChange={(e) => setFbForm({ ...fbForm, hashtags: e.target.value })}
                  placeholder="#reels #fbviral #trending"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MetadataPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400">Loading editor...</div>}>
      <MetadataEditor />
    </Suspense>
  );
}
