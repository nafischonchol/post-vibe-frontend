function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  if (envUrl.endsWith("/api/v1")) return envUrl;
  if (envUrl.endsWith("/api")) return `${envUrl}/v1`;
  return `${envUrl.replace(/\/$/, "")}/api/v1`;
}

const API_BASE_URL = getApiBaseUrl();

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
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

export const adminApi = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    return request("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Dashboard Overview
  getDashboard: async (token?: string) => {
    return request("/admin/dashboard", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Tenants
  getTenants: async (params?: Record<string, string>, token?: string) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/admin/tenants${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createTenant: async (payload: Record<string, any>, token?: string) => {
    return request("/admin/tenants", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  getTenant: async (id: number, token?: string) => {
    return request(`/admin/tenants/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateTenant: async (id: number, payload: Record<string, any>, token?: string) => {
    return request(`/admin/tenants/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  suspendTenant: async (id: number, token?: string) => {
    return request(`/admin/tenants/${id}/suspend`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  activateTenant: async (id: number, token?: string) => {
    return request(`/admin/tenants/${id}/activate`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  setQuotaOverride: async (id: number, payload: Record<string, any>, token?: string) => {
    return request(`/admin/tenants/${id}/quota-override`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  // Subscription Plans
  getPlans: async (token?: string) => {
    return request("/admin/plans", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  createPlan: async (payload: Record<string, any>, token?: string) => {
    return request("/admin/plans", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  updatePlan: async (id: number, payload: Record<string, any>, token?: string) => {
    return request(`/admin/plans/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  deletePlan: async (id: number, token?: string) => {
    return request(`/admin/plans/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Global Settings
  getSettings: async (token?: string) => {
    return request("/admin/settings", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateSettings: async (settings: Record<string, any>, token?: string) => {
    return request("/admin/settings", {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ settings }),
    });
  },

  // Platform Applications (OAuth Credentials)
  getPlatformApplications: async (token?: string) => {
    return request("/admin/platform-applications", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updatePlatformApplication: (platform: string, payload: Record<string, any>, token?: string) => {
    return request(`/admin/platform-applications/${platform}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  // AI Configuration
  getAiSettings: async (token?: string) => {
    return request("/admin/ai-settings", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateAiSettings: async (payload: Record<string, any>, token?: string) => {
    return request("/admin/ai-settings", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },

  testAiConnection: async (payload: { provider?: string; api_key?: string; default_model?: string; model?: string }, token?: string) => {
    return request("/admin/ai-settings/test", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(payload),
    });
  },
};
