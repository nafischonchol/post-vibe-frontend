"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Building2,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { adminApi } from "@/services/admin-api";

interface TenantItem {
  id: number;
  name: string;
  email: string;
  status: string;
  subscription?: {
    id: number;
    billing_cycle: string;
    status: string;
    starts_at: string;
    expires_at: string | null;
    plan?: {
      name: string;
      tier: string;
      price_monthly: string;
      price_yearly: string;
    };
  };
}

export default function SubscriptionsPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTenants({ per_page: "50" });
      setTenants(res.resources || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Active Subscriptions & Billings"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Subscriptions" }]}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubscriptions}
          disabled={loading}
          className="border-slate-200 text-slate-700"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Tenant Billing Accounts
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Active workspace billing cycles, renewal windows, and plan allocations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading subscriptions...</div>
          ) : tenants.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tenant subscriptions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Workspace</th>
                    <th className="py-3 px-4">Assigned Plan</th>
                    <th className="py-3 px-4">Cycle</th>
                    <th className="py-3 px-4">Subscription Status</th>
                    <th className="py-3 px-4 text-right">Renewal Date</th>
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                          {t.subscription?.plan?.name || "Pro Plan"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono capitalize text-slate-700">
                        {t.subscription?.billing_cycle || "monthly"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            t.subscription?.status === "active" || !t.subscription
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {t.subscription?.status || "active"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-600">
                        {t.subscription?.expires_at
                          ? new Date(t.subscription.expires_at).toLocaleDateString()
                          : "Auto-renew"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
