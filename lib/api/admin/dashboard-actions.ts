"use server";

import { fetchApi, rethrowNextErrors } from "../common";

export type AdminDashboardStats = {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  totalVideosCollected: number;
  totalVideosProcessed: number;
  totalPublishingBatches: number;
  successfulUploads: number;
  failedUploads: number;
  aiTokensConsumed: number;
  estimatedAiCost: number;
  s3StorageMb: number;
  queueBacklog: number;
  failedJobs: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats | null> {
  try {
    const response = await fetchApi("/admin/dashboard-stats", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.resources || null;
  } catch (error) {
    rethrowNextErrors(error);
    console.error("Failed to fetch admin dashboard stats:", error);
    return null;
  }
}
