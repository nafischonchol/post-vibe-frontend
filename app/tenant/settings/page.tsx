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
import { SearchableSelect } from "@/components/ui/searchable-select";

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
    <div className="space-y-6 w-full">
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
                <SearchableSelect
                  options={[
                    { value: "Asia/Dhaka", label: "Asia/Dhaka", subLabel: "Bangladesh Standard Time (UTC+6)", badge: "UTC+6" },
                    { value: "UTC", label: "UTC", subLabel: "Coordinated Universal Time", badge: "UTC+0" },
                    { value: "America/New_York", label: "America/New_York", subLabel: "Eastern Time (EST)", badge: "UTC-5" },
                    { value: "America/Los_Angeles", label: "America/Los_Angeles", subLabel: "Pacific Time (PST)", badge: "UTC-8" },
                    { value: "Europe/London", label: "Europe/London", subLabel: "Greenwich Mean Time (GMT)", badge: "UTC+0" },
                    { value: "Asia/Dubai", label: "Asia/Dubai", subLabel: "Gulf Standard Time (GST)", badge: "UTC+4" },
                    { value: "Asia/Singapore", label: "Asia/Singapore", subLabel: "Singapore Standard Time (SGT)", badge: "UTC+8" },
                  ]}
                  value={settings.timezone}
                  onChange={(val) => setSettings({ ...settings, timezone: val })}
                  placeholder="Select Timezone"
                  searchPlaceholder="Search timezone or country..."
                />
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
