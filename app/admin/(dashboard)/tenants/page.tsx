"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Ban,
  Sliders,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

interface TenantItem {
  id: number;
  name: string;
  slug: string;
  email: string;
  status: "active" | "suspended" | "pending";
  timezone: string;
  created_at: string;
  subscription?: {
    plan?: {
      name: string;
      tier: string;
    };
  };
  videos_count?: number;
  publishing_batches_count?: number;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  // Create Tenant Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    timezone: "Asia/Dhaka",
    owner_name: "",
    owner_email: "",
    owner_password: "password123",
  });

  // Quota Override Modal
  const [overrideModalTenant, setOverrideModalTenant] = useState<TenantItem | null>(null);
  const [globalDailyQuota, setGlobalDailyQuota] = useState(100);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = { page: page.toString() };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await adminApi.getTenants(params);
      setTenants(res.resources || []);
      if (res.meta) {
        setMeta({ total: res.meta.total, last_page: res.meta.last_page });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTenants();
  };

  const handleToggleStatus = async (tenant: TenantItem) => {
    const isSuspending = tenant.status === "active";
    const action = isSuspending ? "suspend" : "activate";
    if (!confirm(`Are you sure you want to ${action} workspace "${tenant.name}"?`)) return;

    try {
      if (isSuspending) {
        await adminApi.suspendTenant(tenant.id);
      } else {
        await adminApi.activateTenant(tenant.id);
      }
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenant.id ? { ...t, status: isSuspending ? "suspended" : "active" } : t
        )
      );
    } catch (err: any) {
      alert(err?.message || `Failed to ${action} tenant.`);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);
      await adminApi.createTenant(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        email: "",
        timezone: "Asia/Dhaka",
        owner_name: "",
        owner_email: "",
        owner_password: "password123",
      });
      await fetchTenants();
    } catch (err: any) {
      setError(err?.message || "Failed to onboard new tenant workspace.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalTenant) return;
    try {
      await adminApi.setQuotaOverride(overrideModalTenant.id, {
        global_daily_quota: globalDailyQuota,
      });
      alert("Quota override applied successfully.");
      setOverrideModalTenant(null);
      fetchTenants();
    } catch (err: any) {
      alert(err?.message || "Failed to apply quota override.");
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Tenant Management"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Tenants" }]}
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTenants}
            disabled={loading}
            className="border-slate-200 text-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Onboard Tenant
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchTenants} className="text-rose-700">
            Dismiss
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tenant name, slug, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-4">
            Search
          </Button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
        </select>
      </div>

      {/* Tenants Table */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading workspaces...</div>
          ) : tenants.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No workspaces found. Click &quot;Onboard Tenant&quot; to register the first organization.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Workspace</th>
                    <th className="py-3 px-4">Slug / Timezone</th>
                    <th className="py-3 px-4">Subscription Plan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Videos / Batches</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-xs">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-slate-700">{t.slug}</div>
                        <div className="text-[11px] text-slate-400">{t.timezone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                          {t.subscription?.plan?.name || "Pro Tier"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            t.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600">
                        {t.videos_count ?? 0} videos · {t.publishing_batches_count ?? 0} batches
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOverrideModalTenant(t);
                              setGlobalDailyQuota(100);
                            }}
                            className="h-7 px-2 text-xs border-slate-200 text-slate-600"
                            title="Custom Quota Override"
                          >
                            <Sliders className="h-3 w-3 mr-1" />
                            Quota
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(t)}
                            className={`h-7 px-2 text-xs ${
                              t.status === "active"
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {t.status === "active" ? (
                              <>
                                <Ban className="h-3 w-3 mr-1" /> Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Activate
                              </>
                            )}
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

      {/* Onboard Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Onboard New Tenant Workspace</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Workspace Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Creator Lab"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Organization Email</Label>
                  <Input
                    type="email"
                    placeholder="contact@creatorlab.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Timezone</Label>
                <select
                  value={createForm.timezone}
                  onChange={(e) => setCreateForm({ ...createForm, timezone: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Initial Workspace Owner
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Owner Full Name</Label>
                    <Input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={createForm.owner_name}
                      onChange={(e) => setCreateForm({ ...createForm, owner_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Owner Email</Label>
                    <Input
                      type="email"
                      placeholder="john@creatorlab.com"
                      value={createForm.owner_email}
                      onChange={(e) => setCreateForm({ ...createForm, owner_email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mt-3">
                  <Label className="text-xs font-semibold text-slate-700">Temporary Password</Label>
                  <Input
                    type="password"
                    value={createForm.owner_password}
                    onChange={(e) => setCreateForm({ ...createForm, owner_password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isCreating ? "Onboarding..." : "Provision Workspace"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quota Override Modal */}
      {overrideModalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Quota Override: {overrideModalTenant.name}
              </h2>
              <button
                onClick={() => setOverrideModalTenant(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Custom Global Daily Video Limit
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={5000}
                  value={globalDailyQuota}
                  onChange={(e) => setGlobalDailyQuota(parseInt(e.target.value) || 10)}
                  required
                />
                <p className="text-[11px] text-slate-500">
                  Overrides standard plan limit for this workspace.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOverrideModalTenant(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Override
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
