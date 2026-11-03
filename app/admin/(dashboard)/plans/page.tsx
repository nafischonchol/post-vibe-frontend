"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Edit,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Video,
  Gauge,
  Sliders,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  price_monthly: string;
  price_yearly: string;
  global_daily_quota: number;
  team_member_limit: number;
  storage_limit_mb: number;
  status: string;
  platform_quotas?: Array<{
    id: number;
    platform: string;
    daily_quota: number;
    enabled: boolean;
  }>;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price_monthly: 0,
    price_yearly: 0,
    global_daily_quota: 10,
    team_member_limit: 1,
    storage_limit_mb: 5000,
  });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getPlans();
      setPlans(res.resources || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditClick = (plan: PlanItem) => {
    setEditingPlan(plan);
    setEditForm({
      name: plan.name,
      price_monthly: parseFloat(plan.price_monthly) || 0,
      price_yearly: parseFloat(plan.price_yearly) || 0,
      global_daily_quota: plan.global_daily_quota,
      team_member_limit: plan.team_member_limit,
      storage_limit_mb: plan.storage_limit_mb,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      setSaving(true);
      await adminApi.updatePlan(editingPlan.id, editForm);
      setEditingPlan(null);
      await fetchPlans();
    } catch (err: any) {
      alert(err?.message || "Failed to update plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Subscription Tiers & Quota Limits"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Plans" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPlans}
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
          <Button size="sm" variant="ghost" onClick={fetchPlans} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-slate-200 shadow-xs bg-white flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {plan.slug}
                </span>
                <span className="text-xs text-slate-400 capitalize">{plan.status}</span>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 mt-2">{plan.name}</CardTitle>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">${plan.price_monthly}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Global Daily Quota:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {plan.global_daily_quota} videos/day
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Team Seats:</span>
                  <span className="font-mono text-slate-900">{plan.team_member_limit} members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Temp S3 Storage:</span>
                  <span className="font-mono text-slate-900">{plan.storage_limit_mb} MB</span>
                </div>

                {/* Per Platform Allowances */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Platform Daily Allowances:
                  </span>
                  {plan.platform_quotas?.map((pq) => (
                    <div key={pq.id} className="flex justify-between text-[11px]">
                      <span className="capitalize text-slate-600">{pq.platform}:</span>
                      <span className="font-mono text-slate-900">{pq.daily_quota}/day</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(plan)}
                  className="w-full text-xs h-8 border-slate-200 text-slate-700"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit Plan & Limits
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Edit Tier: {editingPlan.name}</h2>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Plan Name</Label>
                <Input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Monthly Price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.price_monthly}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price_monthly: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Daily Video Quota</Label>
                  <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={editForm.global_daily_quota}
                    onChange={(e) =>
                      setEditForm({ ...editForm, global_daily_quota: parseInt(e.target.value) || 10 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPlan(null)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
