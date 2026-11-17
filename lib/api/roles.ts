import "server-only";

import {
  extractPagination,
  fetchApi,
  asObject,
  asString,
  asNumber,
  asBoolean,
  extractList,
  extractOne,
  type BasePagination,
} from "./common";

export type RoleApiModel = {
  id: string;
  name: string;
  is_active: boolean;
  description: string;
  assigned_user_count: number;
};

export type GetRolesParams = {
  page?: number;
  per_page?: number;
};

export type RolesListResult = {
  items: RoleApiModel[];
  pagination: BasePagination;
};

function normalizeRole(value: unknown): RoleApiModel {
  const item = asObject(value);

  return {
    id: asString(item.id),
    name: asString(item.name),
    is_active: asBoolean(item.is_active ?? item.isActive ?? item.status, true),
    description: asString(item.description),
    assigned_user_count: asNumber(
      item.assigned_user_count ?? item.assignedUsersCount ?? item.users_count,
      0,
    ),
  };
}

export async function getRolesList(
  params?: GetRolesParams,
): Promise<RolesListResult> {
  const fallbackPage = params?.page ?? 1;
  const fallbackper_page = params?.per_page ?? 20;

  try {
    const query = new URLSearchParams();

    if (params?.page !== undefined) {
      query.set("page", String(params.page));
    }

    if (params?.per_page !== undefined) {
      query.set("per_page", String(params.per_page));
    }

    const path = query.toString()
      ? `/admin/roles?${query.toString()}`
      : "/admin/roles";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load roles.");
    }

    return {
      items: extractList(payload).map(normalizeRole),
      pagination: extractPagination(payload, fallbackPage, fallbackper_page),
    };
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return {
      items: [],
      pagination: {
        current_page: fallbackPage,
        last_page: fallbackPage,
        per_page: fallbackper_page,
        total: 0,
      },
    };
  }
}

export async function getRoles(
  params?: GetRolesParams,
): Promise<RoleApiModel[]> {
  const { items } = await getRolesList(params);
  return items;
}

export async function getRoleById(
  roleId: string,
): Promise<RoleApiModel | null> {
  try {
    const response = await fetchApi(`/admin/roles/${roleId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load role details.",
      );
    }

    const item = extractOne(payload);
    return item ? normalizeRole(item) : null;
  } catch (error) {
    console.error(`Failed to fetch role ${roleId}:`, error);
    return null;
  }
}
