"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Key,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

export default function AiConfigPage() {
  const [provider, setProvider] = useState("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [defaultModel, setDefaultModel] = useState("google/gemini-2.0-flash-001");
  const [models, setModels] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchAiSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAiSettings();
      const data = res.data || res.resources || {};
      if (data.provider) setProvider(data.provider);
      if (data.default_model) setDefaultModel(data.default_model);
      if (data.available_models) setModels(data.available_models);
    } catch (err: any) {
      setError(err?.message || "Failed to load AI settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await adminApi.updateAiSettings({
        provider,
        api_key: apiKey || undefined,
        default_model: defaultModel,
      });
      setSuccess("AI provider credentials updated & encrypted at rest.");
      setApiKey("");
    } catch (err: any) {
      setError(err?.message || "Failed to save AI configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await adminApi.testAiConnection({
        provider,
        api_key: apiKey || undefined,
        model: defaultModel,
      });
      setTestResult(res?.message || "Connection successful! Gateway latency verified.");
    } catch (err: any) {
      alert(err?.message || "Connection test failed.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="AI Provider & Model Configuration"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "AI Config" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAiSettings}
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
          <Button size="sm" variant="ghost" onClick={fetchAiSettings} className="text-rose-700">
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

      {testResult && (
        <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 text-xs flex items-center gap-2">
          <Zap className="h-4 w-4 shrink-0 text-indigo-600" />
          <span>{testResult}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 w-full">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Primary AI Gateway
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Post-Vibe uses OpenRouter / Gemini to generate batched titles, captions, and hashtags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">AI Provider</Label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="openrouter">OpenRouter (Recommended - Aggregated Multi-Model)</option>
                <option value="gemini">Google Gemini Direct API</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                API Key (AES-256 Encrypted)
              </Label>
              <Input
                type="password"
                placeholder="sk-or-v1-••••••••••••••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-[11px] text-slate-400">
                Leave empty to retain existing configured secret key.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Default Model</Label>
              <Input
                type="text"
                placeholder="e.g. google/gemini-2.0-flash-001"
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-400">
                Recommended: <code>google/gemini-2.0-flash-001</code> for optimal speed and low latency.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={testing}
                className="border-slate-200 text-slate-700"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                {testing ? "Testing Ping..." : "Test Connection"}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? "Saving..." : "Save AI Credentials"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
