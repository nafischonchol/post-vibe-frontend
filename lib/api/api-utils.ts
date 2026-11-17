export type FieldErrors = Record<string, string[]>;

export type BasePagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function normalizeImageUrl(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.path === "string") return obj.path;
    if (typeof obj.image === "string") return obj.image;
  }
  return null;
}

export function extractFieldErrors(data: any): FieldErrors | null {
  const errors = data?.errors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return null;
  }
  const result: FieldErrors = {};
  for (const [key, value] of Object.entries(errors)) {
    if (Array.isArray(value)) {
      result[key] = value.map((v) => String(v));
    } else if (typeof value === "string") {
      result[key] = [value];
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

export function extractPagination(
  payload: any,
  fallbackPage: number,
  fallbackper_page: number,
): BasePagination {
  const pagination = payload?.meta ?? payload?.pagination ?? {};
  const current_page = Math.max(
    1,
    Number(pagination?.current_page ?? fallbackPage),
  );
  const last_page = Math.max(1, Number(pagination?.last_page ?? fallbackPage));
  const per_page = Math.max(
    1,
    Number(pagination?.per_page ?? fallbackper_page) || fallbackper_page,
  );
  const total = Math.max(0, Number(pagination?.total ?? 0) || 0);

  return {
    current_page: current_page,
    last_page: last_page,
    per_page: per_page,
    total: total,
  };
}

export function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

export function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const num = Number(value);
    if (!isNaN(num)) return num;
  }
  return fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "active"].includes(normalized)) return true;
    if (["0", "false", "no", "inactive"].includes(normalized)) return false;
  }
  return fallback;
}

export function extractList(payload: unknown, resourceKey = "items"): unknown[] {
  if (Array.isArray(payload)) return payload;

  const root = asObject(payload);
  if (Array.isArray(root.resources)) return root.resources;
  if (Array.isArray(root.data)) return root.data;

  const resources = asObject(root.resources);
  const candidates = [
    root[resourceKey],
    resources[resourceKey],
    resources.data,
    resources.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

export function extractOne(payload: unknown, resourceKey = "item"): unknown | null {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const root = payload as Record<string, unknown>;
    if (root.id !== undefined) return root;
  }

  const root = asObject(payload);
  const resources = asObject(root.resources);
  const candidates = [
    root[resourceKey],
    root.data,
    resources[resourceKey],
    resources.data,
    resources.item,
    resources,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  return null;
}
