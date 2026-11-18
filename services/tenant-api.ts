function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  if (envUrl.endsWith("/api/v1")) return envUrl;
  if (envUrl.endsWith("/api")) return `${envUrl}/v1`;
  return `${envUrl.replace(/\/$/, "")}/api/v1`;
}

const API_BASE_URL = getApiBaseUrl();

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("tenant_token") : null;
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const tenantApi = {
  // Authentication & Profile
  register: async (payload: {
    name: string;
    email: string;
    owner_name: string;
    owner_email: string;
    owner_password: string;
    timezone?: string;
  }) => {
    return request("/tenant/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return request("/tenant/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  me: async (token?: string) => {
    return request("/tenant/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  logout: async (token?: string) => {
    return request("/tenant/logout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Dashboard Overview
  getDashboard: async (token?: string) => {
    return request("/tenant/dashboard", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Video Sources
  getSources: async (token?: string) => {
    return request("/tenant/sources", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createSource: async (payload: { platform: string; source_identifier?: string; source_url: string; name: string; scan_frequency?: number }, token?: string) => {
    return request("/tenant/sources", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  updateSource: async (id: number, payload: Record<string, any>, token?: string) => {
    return request(`/tenant/sources/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  deleteSource: async (id: number, token?: string) => {
    return request(`/tenant/sources/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  scrapeVideo: async (url: string, sourceId?: number, token?: string) => {
    return request("/tenant/sources/scrape-video", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ url, source_id: sourceId }),
    });
  },

  // Videos
  getVideos: async (params?: Record<string, string>, token?: string) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/tenant/videos${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getVideo: async (id: number, token?: string) => {
    return request(`/tenant/videos/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  reprocessVideo: async (id: number, mediaUrl?: string, token?: string) => {
    return request(`/tenant/videos/${id}/reprocess`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ media_url: mediaUrl }),
    });
  },

  // Platform Metadata
  getVideoMetadata: async (videoId: number, token?: string) => {
    return request(`/tenant/videos/${videoId}/metadata`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateVideoMetadata: async (videoId: number, platform: string, payload: Record<string, any>, token?: string) => {
    return request(`/tenant/videos/${videoId}/metadata/${platform}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  regenerateVideoMetadata: async (videoId: number, token?: string) => {
    return request(`/tenant/videos/${videoId}/metadata/regenerate`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Connected Social Accounts
  getPlatformAccounts: async (token?: string) => {
    return request("/tenant/platform-accounts", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createPlatformAccount: async (payload: {
    platform: string;
    account_name: string;
    account_handle?: string;
    external_account_id?: string;
    access_token?: string;
    refresh_token?: string;
  }, token?: string) => {
    return request("/tenant/platform-accounts", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  disconnectPlatformAccount: async (id: number, token?: string) => {
    return request(`/tenant/platform-accounts/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getOAuthRedirectUrl: async (platform: string, token?: string) => {
    return request(`/tenant/platform-accounts/oauth/${platform}/redirect`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Publishing Batches
  getBatches: async (params?: Record<string, string>, token?: string) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/tenant/publishing/batches${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createBatch: async (payload: { video_id: number; targets: Array<{ platform: string; account_id?: number }>; scheduled_at?: string }, token?: string) => {
    return request("/tenant/publishing/batches", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  getBatch: async (id: number, token?: string) => {
    return request(`/tenant/publishing/batches/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  cancelBatch: async (id: number, token?: string) => {
    return request(`/tenant/publishing/batches/${id}/cancel`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Quota & Usage
  getQuota: async (token?: string) => {
    return request("/tenant/quota", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getQuotaHistory: async (token?: string) => {
    return request("/tenant/quota/history", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
