"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Clock,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";

export default function TenantSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    workspace_name: "Demo Studio",
    timezone: "Asia/Dhaka",
    daily_start_time: "09:00",
    daily_end_time: "21:00",
    auto_publish_on_ingest: false,
    enable_youtube: true,
    enable_tiktok: true,
    enable_facebook: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tenant Settings</h1>
        <p className="text-sm text-slate-500">
          Configure publishing schedules, time windows, and default destination toggles.
        </p>
      </div>

      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Workspace settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Workspace Profile
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Your organization credentials and quota calculation timezone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Workspace Name</Label>
                <Input
                  type="text"
                  value={settings.workspace_name}
                  onChange={(e) => setSettings({ ...settings, workspace_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Quota Timezone</Label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                  <option value="UTC">UTC (UTC+0)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automated Publishing Windows */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Publishing Windows & Timing
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Restricts automatic syndication execution to high-engagement audience hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Daily Start Time</Label>
                <Input
                  type="time"
                  value={settings.daily_start_time}
                  onChange={(e) => setSettings({ ...settings, daily_start_time: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Daily End Time</Label>
                <Input
                  type="time"
                  value={settings.daily_end_time}
                  onChange={(e) => setSettings({ ...settings, daily_end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_publish"
                checked={settings.auto_publish_on_ingest}
                onChange={(e) =>
                  setSettings({ ...settings, auto_publish_on_ingest: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="auto_publish" className="text-xs font-medium text-slate-700">
                Automatically schedule publishing batch as soon as AI metadata is generated
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Default Platform Toggles */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Default Destination Channels
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select which platforms are pre-selected when launching Together Publishing batches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "enable_youtube", label: "YouTube Shorts / Video" },
              { id: "enable_tiktok", label: "TikTok" },
              { id: "enable_facebook", label: "Facebook Reels" },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={(settings as any)[item.id]}
                  onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={item.id} className="text-xs font-medium text-slate-700">
                  {item.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
