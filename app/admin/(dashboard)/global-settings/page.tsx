"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  Sliders,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({
    video_content_analysis_enabled: true,
    max_daily_ai_spend_usd: 50.0,
    media_retention_days: 7,
    max_video_duration_seconds: 180,
    enable_together_publishing: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getSettings();
      if (res.resources) {
        setSettings((prev) => ({ ...prev, ...res.resources }));
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load global settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await adminApi.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Global Platform Settings"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Global Settings" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
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
          <Button size="sm" variant="ghost" onClick={fetchSettings} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>System settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* AI Processing Settings */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-base font-semibold text-slate-900">
                AI Pipeline & Spending Guards
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Control video content analysis toggle, token circuit breaker, and model routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div>
                <Label htmlFor="ai_analysis" className="text-xs font-semibold text-slate-900">
                  Video Content Analysis (AI Vision / Frame Analysis)
                </Label>
                <p className="text-[11px] text-slate-500">
                  When disabled, AI will only generate platform titles & hashtags from original captions and hashtags, avoiding costly multimodal video token usage.
                </p>
              </div>
              <input
                type="checkbox"
                id="ai_analysis"
                checked={!!settings.video_content_analysis_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, video_content_analysis_enabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Maximum Daily AI Spend Circuit Breaker (USD)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={settings.max_daily_ai_spend_usd}
                onChange={(e) =>
                  setSettings({ ...settings, max_daily_ai_spend_usd: parseFloat(e.target.value) || 0 })
                }
                required
              />
              <p className="text-[11px] text-slate-400">
                Halts non-essential AI generation if the platform exceeds this daily expense.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Storage & Retention */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-base font-semibold text-slate-900">
                Temporary Media Storage & Retention
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              S3 bucket lifecycle rules and cleanup parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Temporary Media Retention (Days)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={90}
                  value={settings.media_retention_days}
                  onChange={(e) =>
                    setSettings({ ...settings, media_retention_days: parseInt(e.target.value) || 7 })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Maximum Video Duration (Seconds)
                </Label>
                <Input
                  type="number"
                  min={15}
                  max={600}
                  value={settings.max_video_duration_seconds}
                  onChange={(e) =>
                    setSettings({ ...settings, max_video_duration_seconds: parseInt(e.target.value) || 180 })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Global Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
