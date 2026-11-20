"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

interface PlatformApp {
  id: number;
  platform: string;
  client_id: string;
  redirect_uri: string;
  status: string;
  is_configured: boolean;
}

export default function PlatformConfigPage() {
  const [apps, setApps] = useState<PlatformApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Forms per platform
  const [forms, setForms] = useState<Record<string, { client_id: string; client_secret: string; redirect_uri: string }>>({
    youtube: { client_id: "", client_secret: "", redirect_uri: "https://postvibe.mohima.skin/api/auth/callback/youtube" },
    tiktok: { client_id: "", client_secret: "", redirect_uri: "https://postvibe.mohima.skin/api/auth/callback/tiktok" },
    facebook: { client_id: "1014592994306470", client_secret: "", redirect_uri: "https://postvibe.mohima.skin/api/auth/callback/facebook" },
  });

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getPlatformApplications();
      const list = res.resources || [];
      setApps(list);

      // Populate existing values
      const updatedForms = { ...forms };
      list.forEach((app: PlatformApp) => {
        if (updatedForms[app.platform]) {
          updatedForms[app.platform] = {
            client_id: app.client_id || "",
            client_secret: "",
            redirect_uri: app.redirect_uri || updatedForms[app.platform].redirect_uri,
          };
        }
      });
      setForms(updatedForms);
    } catch (err: any) {
      setError(err?.message || "Failed to load platform applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSave = async (platform: string) => {
    try {
      setSavingPlatform(platform);
      setError(null);
      setSuccess(null);

      const payload = forms[platform];
      await adminApi.updatePlatformApplication(platform, payload);
      setSuccess(`Application for ${platform.toUpperCase()} saved and encrypted successfully.`);
      await fetchApps();
    } catch (err: any) {
      setError(err?.message || `Failed to configure ${platform}`);
    } finally {
      setSavingPlatform(null);
    }
  };

  const platforms = [
    {
      id: "youtube",
      name: "Google Cloud / YouTube Data API v3",
      doc: "Requires https://www.googleapis.com/auth/youtube.upload",
      badge: "YouTube Shorts",
    },
    {
      id: "tiktok",
      name: "TikTok Developer Kit & Content Posting API",
      doc: "Requires video.upload and user.info.basic scopes",
      badge: "TikTok",
    },
    {
      id: "facebook",
      name: "Meta for Developers / Facebook Graph API",
      doc: "Requires pages_manage_posts and instagram_content_publish",
      badge: "Facebook Reels",
    },
  ];

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Social Platform OAuth Applications"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Platform APIs" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchApps}
          disabled={loading}
          className="border-slate-200 text-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchApps} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* 3 OAuth Platform Config Cards */}
      <div className="space-y-6 w-full">
        {platforms.map((p) => {
          const form = forms[p.id] || { client_id: "", client_secret: "", redirect_uri: "" };
          const isConfigured = apps.some((a) => a.platform === p.id && a.is_configured);

          return (
            <Card key={p.id} className="border-slate-200 shadow-xs bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    {p.name}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                      isConfigured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {isConfigured ? "Active & Configured" : "Unconfigured"}
                  </span>
                </div>
                <CardDescription className="text-xs text-slate-500">{p.doc}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">
                      Client ID / App Key
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. 1092837465-apps.googleusercontent.com"
                      value={form.client_id}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [p.id]: { ...form, client_id: e.target.value },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">
                      Client Secret (Encrypted at rest)
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={form.client_secret}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [p.id]: { ...form, client_secret: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">OAuth Redirect URI</Label>
                  <Input
                    type="url"
                    value={form.redirect_uri}
                    onChange={(e) =>
                      setForms({
                        ...forms,
                        [p.id]: { ...form, redirect_uri: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(p.id)}
                    disabled={savingPlatform === p.id}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {savingPlatform === p.id ? "Saving..." : "Save " + p.badge + " Config"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
