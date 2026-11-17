import "server-only";

import {
  extractPagination,
  fetchApi,
  asObject,
  asString,
  asBoolean,
  extractList,
  extractOne,
  type BasePagination,
} from "./common";

export type UserApiModel = {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  role_id: string;
  role_name: string;
  can_manage_news: boolean;
};

export type GetUsersParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role_id?: string;
};

export type UsersListResult = {
  items: UserApiModel[];
  pagination: BasePagination;
};

function normalizeUser(value: unknown): UserApiModel {
  const item = asObject(value);
  const role = asObject(item.role);

  return {
    id: asString(item.id),
    name: asString(item.name),
    email: asString(item.email),
    phone: asString(item.phone),
    is_active: asBoolean(item.is_active, true),
    role_id: asString(item.role_id ?? role.id),
    role_name: asString(item.role_name ?? role.name),
    can_manage_news: asBoolean(item.can_manage_news, false),
  };
}

export async function getUsersList(
  params?: GetUsersParams,
): Promise<UsersListResult> {
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

    if (params?.search?.trim()) {
      query.set("search", params.search.trim());
    }

    if (params?.role_id?.trim()) {
      query.set("role_id", params.role_id.trim());
    }

    const path = query.toString()
      ? `/admin/users?${query.toString()}`
      : "/admin/users";

    const response = await fetchApi(path);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((payload as any)?.message || "Failed to load users.");
    }

    return {
      items: extractList(payload).map(normalizeUser),
      pagination: extractPagination(payload, fallbackPage, fallbackper_page),
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
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

export async function getUsers(
  params?: GetUsersParams,
): Promise<UserApiModel[]> {
  const { items } = await getUsersList(params);
  return items;
}

export async function getUserById(
  userId: string,
): Promise<UserApiModel | null> {
  try {
    const response = await fetchApi(`/admin/users/${userId}`);
    const payload = await response.json().catch(() => null);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        (payload as any)?.message || "Failed to load user details.",
      );
    }

    const item = extractOne(payload);
    return item ? normalizeUser(item) : null;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}
